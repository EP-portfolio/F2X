"""
Script pour générer une voix off via Google Cloud Text-to-Speech
Avec support SSML pour les pauses

Prérequis :
1. pip install google-cloud-texttospeech
2. Définir la variable d'environnement GOOGLE_APPLICATION_CREDENTIALS
   avec le chemin vers votre fichier JSON de credentials
"""

from google.cloud import texttospeech
import os

# --- CONFIGURATION ---

TEXTE_SSML = """
<speak>
Here is Lisa, a French ninth-grader.
<break time="250ms"/>
Lisa takes her finals at the end of the year and she struggles with math,
<break time="1250ms"/>
especially statistics.
<break time="3250ms"/>
Her parents want to help but cannot find the right solution.
<break time="2650ms"/>

Suddenly, Lisa gets the best advice ever from Sophie.
<break time="1250ms"/>
<prosody rate="slow">Staaat'masssster.</prosody>
<break time="250ms"/>

Stat'master gives your child everything they need: clear lessons, training exercises, assessment exercises, and an AI tutor ready to answer questions so they are supported throughout learning.
<break time="250ms"/>

After each session, a summary is sent to parents so they can see their child's progress.
<break time="1250ms"/>

Lisa now finally feels ready for her finals.
<break time="1250ms"/>

Try the app at 
</speak>
"""

# Fichier de sortie
OUTPUT_FILE = "voiceover_statmaster.mp3"

# Voix anglaise masculine (US), naturelle
VOICE_NAME = "en-US-Neural2-D"
LANGUAGE_CODE = "en-US"

# Paramètres audio
SPEAKING_RATE = 1.0
PITCH = 0.0


def generate_audio():
    """Génère le fichier audio à partir du texte SSML."""

    client = texttospeech.TextToSpeechClient()

    synthesis_input = texttospeech.SynthesisInput(ssml=TEXTE_SSML)

    voice = texttospeech.VoiceSelectionParams(
        language_code=LANGUAGE_CODE,
        name=VOICE_NAME,
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        speaking_rate=SPEAKING_RATE,
        pitch=PITCH,
    )

    print(f"Génération de l'audio avec la voix {VOICE_NAME}...")
    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config,
    )

    with open(OUTPUT_FILE, "wb") as out:
        out.write(response.audio_content)

    print(f"Audio généré : {OUTPUT_FILE}")
    print(f"Taille : {len(response.audio_content) / 1024:.1f} Ko")


if __name__ == "__main__":
    if not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        print("ATTENTION : Variable GOOGLE_APPLICATION_CREDENTIALS non définie.")
        print(
            "Définissez-la avec : export GOOGLE_APPLICATION_CREDENTIALS='chemin/vers/credentials.json'"
        )
        print()

    generate_audio()
