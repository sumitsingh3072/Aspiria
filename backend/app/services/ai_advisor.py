import google.generativeai as genai
from backend.app.core.config import settings
from backend.app.schemas import profile as profile_schema
from backend.models import user as user_model
try:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')
except Exception as e:
    print(f"--- WARNING: Could not configure Gemini API: {e} ---")
    model = None

def generate_initial_prompt(user_profile: user_model.Profile) -> str:
    """
    Generates a system prompt to give the AI context about the user.
    """
    prompt = (
        "You are 'Aspiria', a friendly and expert AI career and skills advisor. "
        "Your goal is to provide personalized, data-driven career guidance. "
        "Here is the user's profile:\n"
    )

    if user_profile:
        prompt += f"- Education Level: {user_profile.education_level or 'Not provided'}\n"
        prompt += f"- Field of Study: {user_profile.field_of_study or 'Not provided'}\n"
        prompt += f"- Skills: {', '.join(user_profile.skills) if user_profile.skills else 'Not provided'}\n" # type: ignore
        prompt += f"- Interests: {', '.join(user_profile.interests) if user_profile.interests else 'Not provided'}\n" # type: ignore
        prompt += f"- Career Aspirations: {user_profile.career_aspirations or 'Not provided'}\n\n"
    else:
        prompt += "- The user has not provided a profile yet. Encourage them to fill out their profile for better recommendations.\n\n"

    prompt += (
        "Based on this profile and our conversation, provide insightful recommendations, "
        "identify skill gaps, and suggest learning resources. Be encouraging and clear."
    )
    return prompt


def get_ai_response(user_message: str, chat_history: list, user_profile: user_model.Profile | None) -> str:
    """
    Gets a response from the Gemini AI based on the user's message,
    profile, and conversation history.
    """
    if not model:
        raise RuntimeError("Gemini API is not configured. Please set the GEMINI_API_KEY environment variable.")

    # Create the context for the AI
    initial_prompt = generate_initial_prompt(user_profile)
    
    # Format the history for the model
    # The history should be a list of alternating user and model messages
    formatted_history = []
    for msg in chat_history:
        role = "user" if msg.is_from_user else "model"
        formatted_history.append({"role": role, "parts": [msg.message]})

    try:
        chat = model.start_chat(history=formatted_history)
        full_message = f"{initial_prompt}\n\n---\n\nUser Question: {user_message}"
        response = chat.send_message(full_message)
        return response.text
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later."
