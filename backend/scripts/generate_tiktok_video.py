import ffmpeg
import requests
from PIL import Image, ImageDraw, ImageFont
import os
from datetime import datetime
from gtts import gTTS
from pydub import AudioSegment
import subprocess


# Generate Text-to-Speech
def text_to_speech(tweet_text, output_audio_path):
    # Ensure the directory exists
    os.makedirs(os.path.dirname(output_audio_path), exist_ok=True)
    tts = gTTS(tweet_text, lang="en")
    tts.save(output_audio_path)
    return output_audio_path


def get_audio_duration(audio_path):
    audio = AudioSegment.from_file(audio_path)
    return len(audio) / 1000  # Duration in seconds


# Combine Video and Audio
def combine_audio_video(input_video, input_audio, output_video):
    command = [
        "ffmpeg",
        "-y",  # Overwrite output
        "-i",
        input_video,  # Input video
        "-i",
        input_audio,  # Input audio
        "-map",
        "0:v",  # Map video
        "-map",
        "1:a",  # Map audio
        "-c:v",
        "copy",  # Copy video codec
        "-c:a",
        "aac",  # Encode audio as AAC
        "-b:a",
        "128k",  # Audio bitrate
        "-ar",
        "48000",  # Audio sampling rate
        "-shortest",  # Match duration of the shortest input
        output_video,
    ]

    # Run the FFmpeg command
    result = subprocess.run(
        command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
    )

    # Log the FFmpeg output for debugging
    print("FFmpeg Output:", result.stdout)
    print("FFmpeg Errors:", result.stderr)

    # Raise an exception if the command fails
    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg failed with return code {result.returncode}")


# Clean the username for directory naming
def clean_username(username):
    return "".join(c if c.isalnum() else "_" for c in username)


# Input from ENV variables
TWEET_TEXT = os.getenv("TWEET_TEXT", "is a phrase that reflects the pride and glory of India, a land of diverse cultures, rich history, and immense talent. Known for its unity in diversity, India is home to over a billion people who speak different languages, follow various traditions, and practice multiple religions, yet live harmoniously. It is the birthplace of great leaders, thinkers, and innovators who have shaped the world. From the snow-clad Himalayas to the serene beaches, India’s landscapes are breathtaking. Its contributions in science, art, and spirituality inspire millions globally. Truly, India is incredible, and Mera Bharat Mahan says it all")
USER_NAME = os.getenv("USER_NAME", "John Doe")
USER_HANDLE = os.getenv("USER_HANDLE", "@johndoe")
PROFILE_URL = os.getenv(
    "PROFILE_URL",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png/220px-Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png",
)

# Dynamic Output Path
USERNAME_DIR = os.path.join("./", clean_username(USER_NAME))
os.makedirs(USERNAME_DIR, exist_ok=True)


# Generate dynamic output file name
def get_output_video_name(username):
    current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    return os.path.join(USERNAME_DIR, f"{username}_{current_time}.mp4")


# File paths
OUTPUT_VIDEO = get_output_video_name(clean_username(USER_NAME))
OUTPUT_IMAGE = os.path.join(USERNAME_DIR, "temp_image.png")
AUDIO_PATH = os.path.join(USERNAME_DIR, "tweet_audio.mp3")
FINAL_VIDEO = os.path.join(USERNAME_DIR, f"{clean_username(USER_NAME)}_final_video.mp4")


# Fetch Profile Picture
def fetch_profile_picture(url, save_path):
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(save_path, "wb") as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
    else:
        Image.new("RGB", (200, 200), color="gray").save(save_path)


# Create Background Image with Text
def create_image():
    profile_size = (200, 200)
    profile_path = os.path.join(USERNAME_DIR, "profile.jpg")
    fetch_profile_picture(PROFILE_URL, profile_path)
    profile_img = Image.open(profile_path).resize(profile_size)

    # Create background
    image = Image.new("RGB", (1080, 1920), color=(40, 40, 80))
    draw = ImageDraw.Draw(image)

    # Add profile picture
    image.paste(profile_img, (440, 100))

    # Add user info
    font_path = "arial.ttf"
    font_name = ImageFont.truetype(font_path, 60)
    font_handle = ImageFont.truetype(font_path, 50)
    font_tweet = ImageFont.truetype(font_path, 45)

    draw.text((360, 320), USER_NAME, fill="white", font=font_name)
    draw.text((360, 400), USER_HANDLE, fill="gray", font=font_handle)

    # Add tweet text
    tweet_lines = wrap_text(TWEET_TEXT, max_length=35)
    y_text = 600
    for line in tweet_lines:
        draw.text((100, y_text), line, fill="white", font=font_tweet)
        y_text += 60

    image.save(OUTPUT_IMAGE)


# Wrap text into lines
def wrap_text(text, max_length=35):
    return [text[i : i + max_length] for i in range(0, len(text), max_length)]


# Generate Video with FFmpeg
def generate_video(audio_path, output_image, output_video):
    # Get the audio duration
    audio_duration = get_audio_duration(audio_path)

    # Extend or loop the video template to match audio duration
    ffmpeg.input(output_image, loop=1, t=audio_duration).output(
        output_video, vf="scale=1080:1920", r=30
    ).run()


if __name__ == "__main__":
    # Step 1: Create Image
    create_image()

    # Step 2: Generate Audio
    audio_path = text_to_speech(TWEET_TEXT, AUDIO_PATH)
    print(f"Audio generated at: {audio_path}")

    # Step 3: Generate Video
    generate_video(audio_path, OUTPUT_IMAGE, OUTPUT_VIDEO)
    print(f"Video generated successfully: {OUTPUT_VIDEO}")

    # Step 4: Combine Audio and Video
    combine_audio_video(OUTPUT_VIDEO, audio_path, FINAL_VIDEO)
    print(f"Final video with audio generated at: {FINAL_VIDEO}")
