import logging
import os
from google.cloud import translate_v2 as translate
logger = logging.getLogger(__name__)

translate_client = None

def get_translate_client():
    """
    Lazy initialization of the Google Translate client.
    This ensures we don't crash on startup if credentials aren't set immediately,
    but we try to connect when needed.
    """
    global translate_client
    if translate_client:
        return translate_client

    try:
        translate_client = translate.Client()
        logger.info(" Google Translate Client initialized successfully ")
    except Exception as e:
        logger.warning(f"Google Translate Client initialization failed: {e}. Translation features will return original text.")
        translate_client = None
    
    return translate_client

def translate_text(text: str, target_language: str = "en") -> dict:
    client = get_translate_client()
    if not client:
        return {
            "translatedText": text,
            "detectedSourceLanguage": "unknown",
            "input": text
        }
        
    try:
        result = client.translate(
            text, 
            target_language=target_language
        )
        return result
        
    except Exception as e:
        logger.error(f"Error translating text: {e}")
        return {
            "translatedText": text,
            "detectedSourceLanguage": "error",
            "input": text
        }