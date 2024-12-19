import ffmpeg
import requests
from PIL import Image, ImageDraw, ImageFont
import os
from datetime import datetime
from gtts import gTTS
import subprocess


# Generate Text-to-Speech
def text_to_speech(tweet_text, output_audio_path):
    # Ensure the directory exists
    os.makedirs(os.path.dirname(output_audio_path), exist_ok=True)
    tts = gTTS(tweet_text, lang="en")
    tts.save(output_audio_path)
    return output_audio_path


# Combine Video and Audio
def combine_audio_video(input_video, input_audio, output_video):
    command = [
        "ffmpeg",
        "-y",
        "-i",
        input_video,
        "-i",
        input_audio,
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-strict",
        "experimental",
        "-shortest",
        output_video,
    ]
    result = subprocess.run(
        command, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True
    )
    print("FFmpeg output:", result.stdout)
    print("FFmpeg errors:", result.stderr)

    command = [
        "ffmpeg",
        "-i",
        input_video,
        "-i",
        input_audio,
        "-map",
        "0:v",
        "-map",
        "1:a",
        "-shortest",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        output_video,
    ]
    subprocess.run(command, check=True)


# Clean the username for directory naming
def clean_username(username):
    return "".join(c if c.isalnum() else "_" for c in username)


# Input from ENV variables
TWEET_TEXT = os.getenv("TWEET_TEXT", "Yeah the audio works its generated and works on the syshhhtumm")
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
def generate_video():
    ffmpeg.input(OUTPUT_IMAGE, loop=1, t=5).output(
        OUTPUT_VIDEO, vf="scale=1080:1920", r=30
    ).run()


if __name__ == "__main__":
    # Step 1: Create Image
    create_image()

    # Step 2: Generate Audio
    audio_path = text_to_speech(TWEET_TEXT, AUDIO_PATH)
    print(f"Audio generated at: {audio_path}")

    # Step 3: Generate Video
    generate_video()
    print(f"Video generated successfully: {OUTPUT_VIDEO}")

    # Step 4: Combine Audio and Video
    combine_audio_video(OUTPUT_VIDEO, audio_path, FINAL_VIDEO)
    print(f"Final video with audio generated at: {FINAL_VIDEO}")
