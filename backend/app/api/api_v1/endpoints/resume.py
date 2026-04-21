from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse, Response
from sqlalchemy.orm import Session
from backend.app.api import deps
from backend.models.user import User, Resume
from backend.app.core.config import settings
from typing import Optional
import json
import os
import tempfile
import subprocess
import pdfplumber
import google.generativeai as genai
import jinja2
from supabase import create_client, Client

router = APIRouter()

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

# Configure Supabase
supabase: Client = None
if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# Configure Jinja2 for LaTeX
template_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'templates')
latex_jinja_env = jinja2.Environment(
    block_start_string='\\BLOCK{',
    block_end_string='}',
    variable_start_string='\\VAR{',
    variable_end_string='}',
    comment_start_string='\\#{',
    comment_end_string='}',

    trim_blocks=True,
    autoescape=False,
    loader=jinja2.FileSystemLoader(template_dir)
)

GEMINI_JSON_PROMPT = """
You are an expert resume parser. Extract the following text from a resume into a structured JSON format.
The JSON must have the following keys and structure:
{{
  "name": "Full Name",
  "email": "Email Address",
  "phone": "Phone Number",
  "linkedin": "LinkedIn URL",
  "github": "GitHub URL",
  "education": [
    {{
      "institution": "University/College Name",
      "duration": "Start - End Date",
      "degree": "Degree Name",
      "score": "CGPA/Percentage"
    }}
  ],
  "experience": [
    {{
      "company": "Company Name",
      "duration": "Start - End Date",
      "role": "Job Title",
      "location": "Location",
      "details": [
        "Bullet point 1",
        "Bullet point 2"
      ]
    }}
  ],
  "skills": [
    {{
      "category": "Skill Category (e.g., Languages, Technologies)",
      "items": "Comma separated list of skills"
    }}
  ],
  "projects": [
    {{
      "name": "Project Name",
      "link": "Project live link if any",
      "repo_link": "Project repository link if any",
      "technologies": "Comma separated list of tech used",
      "duration": "Duration of project",
      "details": [
        "Bullet point 1",
        "Bullet point 2"
      ]
    }}
  ],
  "achievements": [
    {{
      "title": "Achievement Title",
      "description": "Achievement Details"
    }}
  ]
}}

Tailor the extraction slightly if a job description is provided, emphasizing relevant skills and experiences.
Return ONLY valid JSON. Do not include markdown code blocks.

Job Description (if any):
{job_description}

Resume Text:
{resume_text}
"""

from pydantic import BaseModel
class CompileRequest(BaseModel):
    latex: str

from backend.models.job import Job
from backend.models.user import Profile
from backend.app.services.ats_scorer import calculate_ats_score

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # Save uploaded file temporarily
    file_bytes = await file.read()
    temp_pdf_path = ""
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file_bytes)
        temp_pdf_path = tmp.name

    resume_url = None
    # Upload to Supabase
    if supabase:
        try:
            file_path = f"aspiria/{current_user.id}/{file.filename}"
            res = supabase.storage.from_("aspiria").upload(
                file=file_bytes,
                path=file_path,
                file_options={"content-type": "application/pdf", "upsert": "true"}
            )
            # Get public URL
            resume_url = supabase.storage.from_("aspiria").get_public_url(file_path)
        except Exception as e:
            print(f"Failed to upload to Supabase: {e}")

    # Extract text with pdfplumber
    text = ""
    try:
        with pdfplumber.open(temp_pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        os.remove(temp_pdf_path)
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")
    
    os.remove(temp_pdf_path)

    # Call Gemini to get JSON
    prompt = GEMINI_JSON_PROMPT.format(
        job_description="None provided",
        resume_text=text
    )
    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        # Clean up markdown block if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        parsed_json = json.loads(response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract structured data from AI: {str(e)}")

    # Save to DB
    resume_record = Resume(
        user_id=current_user.id,
        resume_url=resume_url,
        parsed_json=parsed_json
    )
    db.add(resume_record)

    # Mark profile as complete
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if profile:
        profile.is_complete = True
    
    db.commit()
    db.refresh(resume_record)

    return {"resume_id": resume_record.id, "parsed_data": parsed_json}


class TailorRequest(BaseModel):
    job_id: int

@router.post("/tailor")
async def tailor_resume(
    request: TailorRequest,
    current_user: User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db)
):
    job = db.query(Job).filter(Job.id == request.job_id).first()
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.id.desc()).first()

    if not job or not resume:
        raise HTTPException(status_code=404, detail="Job or Resume not found. Please upload a base resume first.")

    base_json = resume.parsed_json or {}
    job_desc = job.description or ""
    job_skills = job.skills or []

    # Calculate BEFORE score
    score_before = calculate_ats_score(base_json, job_desc, job_skills)

    # Tailor JSON with Gemini
    tailor_prompt = f"""
    You are an expert ATS resume optimizer. Given a Base Resume JSON and a Job Description, tailor the Base Resume to match the Job Description perfectly.
    Keep all original keys. You can reorder skills, tweak experience descriptions, or emphasize different aspects to maximize ATS score. 
    Do NOT lie or invent completely new jobs, but do reframe existing experiences to use the keywords present in the Job Description.
    
    Job Description:
    {job_desc}
    
    Base Resume JSON:
    {json.dumps(base_json)}
    
    Return ONLY valid JSON with the exact same structure as the input JSON. No markdown formatting.
    """
    
    try:
        response = model.generate_content(tailor_prompt)
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        tailored_json = json.loads(response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to tailor resume: {str(e)}")

    # Calculate AFTER score
    score_after = calculate_ats_score(tailored_json, job_desc, job_skills)

    # Render LaTeX
    try:
        template = latex_jinja_env.get_template('resume_template.tex')
        latex_str = template.render(**tailored_json)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to render LaTeX template: {str(e)}")

    return {
        "latex": latex_str,
        "score_before": score_before,
        "score_after": score_after,
        "tailored_json": tailored_json
    }


@router.post("/compile")
async def compile_resume(
    request: CompileRequest,
    current_user: User = Depends(deps.get_current_active_user)
):
    with tempfile.TemporaryDirectory() as temp_dir:
        tex_path = os.path.join(temp_dir, "resume.tex")
        pdf_path = os.path.join(temp_dir, "resume.pdf")

        with open(tex_path, "w", encoding="utf-8") as f:
            f.write(request.latex)

        try:
            # Run tectonic
            result = subprocess.run(
                ["tectonic", tex_path],
                cwd=temp_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            if result.returncode != 0:
                print(f"Tectonic error: {result.stderr}")
                raise HTTPException(status_code=500, detail="Failed to compile LaTeX")

            with open(pdf_path, "rb") as f:
                pdf_bytes = f.read()

            return Response(content=pdf_bytes, media_type="application/pdf")
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Compilation error: {str(e)}")
