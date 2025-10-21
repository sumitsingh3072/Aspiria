import google.generativeai as genai
from sqlalchemy.orm import Session
from backend.app.core.config import settings
from backend.models import user as user_model
from backend.db import crud

# Configure the Gemini API client
try:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')
except Exception as e:
    print(f"--- WARNING: Could not configure Gemini API: {e} ---")
    model = None

def format_jobs_for_prompt(jobs: list) -> str:
    """Formats a list of job objects into a string for the AI prompt."""
    if not jobs:
        return "No specific job listings found in the database matching the user's skills."
    
    job_strings = []
    for job in jobs:
        job_strings.append(
            f"- Title: {job.title}\n  Company: {job.company}\n  Location: {job.location}\n  Required Skills: {', '.join(job.skills)}"
        )
    return "Here are some relevant live job listings from our database:\n" + "\n".join(job_strings)


def generate_augmented_prompt(user_profile: user_model.Profile, relevant_jobs: list) -> str:
    """
    Generates a system prompt to give the AI context about the user AND the market.
    """
    prompt = (
        "You are 'Aspiria', a friendly and expert AI career and skills advisor. "
        "Your goal is to provide personalized, data-driven career guidance. "
        "Ground your advice in the provided real-time job market data.\n\n"
        "--- User Profile ---\n"
    )

    if user_profile:
        prompt += f"- Education Level: {user_profile.education_level or 'Not provided'}\n"
        prompt += f"- Field of Study: {user_profile.field_of_study or 'Not provided'}\n"
        prompt += f"- Skills: {', '.join(user_profile.skills) if user_profile.skills else 'Not provided'}\n" #type : ignore
        prompt += f"- Interests: {', '.join(user_profile.interests) if user_profile.interests else 'Not provided'}\n" #type : ignore
        prompt += f"- Career Aspirations: {user_profile.career_aspirations or 'Not provided'}\n\n"
    else:
        prompt += "- The user has not provided a profile yet. Encourage them to fill it out.\n\n"

    prompt += "--- Live Job Market Data (for context) ---\n"
    prompt += format_jobs_for_prompt(relevant_jobs) + "\n\n"

    prompt += (
        "Based on the user's profile AND the live job data, provide insightful recommendations. "
        "If you mention a job, refer to the data. Be encouraging and clear."
    )
    return prompt


def get_ai_response(
    db: Session,
    user_message: str,
    chat_history: list,
    user_profile: user_model.Profile | None
) -> str:
    """
    Gets a response from the Gemini AI, augmented with relevant job data from the DB.
    """
    if not model:
        raise RuntimeError("Gemini API is not configured. Please set the GEMINI_API_KEY environment variable.")

    # --- RAG: RETRIEVAL STEP ---
    # Combine user's profile skills with any skills mentioned in their message
    search_skills = user_profile.skills if user_profile and user_profile.skills else []
    # A simple way to extract potential skills from the message
    search_skills.extend([word.strip() for word in user_message.lower().split() if len(word) > 2])
    
    relevant_jobs = crud.get_relevant_jobs(db, skills=list(set(search_skills)))

    # --- RAG: AUGMENTATION STEP ---
    augmented_prompt = generate_augmented_prompt(user_profile, relevant_jobs)
    
    # Format the history for the model
    formatted_history = []
    for msg in chat_history:
        role = "user" if msg.is_from_user else "model"
        formatted_history.append({"role": role, "parts": [msg.message]})

    try:
        chat = model.start_chat(history=formatted_history)
        
        # Prepend the full augmented prompt to the user's latest message for context
        full_message = f"{augmented_prompt}\n\n---\n\nUser Question: {user_message}"

        response = chat.send_message(full_message)
        return response.text
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later."

