import re
import json
import spacy
import numpy as np
import google.generativeai as genai
from backend.app.core.config import settings

# Initialize spaCy
try:
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = None

# Gemini configure
genai.configure(api_key=settings.GEMINI_API_KEY)
embedding_model = 'models/gemini-embedding-2-preview'
gemini_model = genai.GenerativeModel('gemini-2.5-flash')

def calculate_ats_score(parsed_json: dict, job_desc: str, job_skills: list) -> dict:
    # 1. Keyword Overlap (40%)
    jd_skills = set()
    if nlp and job_desc:
        doc = nlp(job_desc)
        for ent in doc.ents:
            if ent.label_ in ["ORG", "PRODUCT", "WORK_OF_ART", "NORP"]:
                jd_skills.add(ent.text.lower())
    
    for skill in job_skills or []:
        jd_skills.add(skill.lower())

    resume_skills = set()
    for cat in parsed_json.get("skills", []):
        for s in cat.get("items", "").split(","):
            resume_skills.add(s.strip().lower())
    
    overlap = len(jd_skills.intersection(resume_skills))
    keyword_score = min(100, (overlap / len(jd_skills) * 100)) if jd_skills else 100

    # 2. Semantic Similarity (40%)
    resume_text_for_embedding = json.dumps(parsed_json.get("experience", []))
    try:
        jd_emb = genai.embed_content(model=embedding_model, content=job_desc, task_type="retrieval_document")["embedding"]
        res_emb = genai.embed_content(model=embedding_model, content=resume_text_for_embedding, task_type="retrieval_query")["embedding"]
        
        # Cosine similarity
        jd_vec = np.array(jd_emb)
        res_vec = np.array(res_emb)
        sim = np.dot(jd_vec, res_vec) / (np.linalg.norm(jd_vec) * np.linalg.norm(res_vec))
        semantic_score = max(0, sim * 100)
    except Exception as e:
        print(f"Embedding error: {e}")
        semantic_score = 50 # fallback

    # 3. Action & Impact Scoring (20%)
    impact_count = 0
    total_details = 0
    experience = parsed_json.get("experience", [])
    all_details = []
    
    for exp in experience:
        details = exp.get("details", [])
        for d in details:
            total_details += 1
            all_details.append(d)
            if re.search(r'\d+%?|\$\d+', d):
                impact_count += 1
    
    regex_impact_score = (impact_count / total_details * 100) if total_details > 0 else 0
    
    # Optional Gemini Fast Pass
    gemini_impact_score = regex_impact_score
    if all_details:
        prompt = f"Score the impact statements in this resume from 1-100 based on their use of action verbs and quantifiable metrics. Return ONLY the integer score.\n\nStatements: {all_details}"
        try:
            resp = gemini_model.generate_content(prompt).text.strip()
            match = re.search(r'\d+', resp)
            if match:
                gemini_impact_score = int(match.group())
        except:
            pass

    final_impact_score = (regex_impact_score + gemini_impact_score) / 2

    # Final Math
    total_score = (keyword_score * 0.40) + (semantic_score * 0.40) + (final_impact_score * 0.20)
    
    return {
        "total_score": round(total_score, 2),
        "breakdown": {
            "keyword_overlap_score": round(keyword_score, 2),
            "semantic_similarity_score": round(semantic_score, 2),
            "action_impact_score": round(final_impact_score, 2)
        }
    }
