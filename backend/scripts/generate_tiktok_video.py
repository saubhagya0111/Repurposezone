import ffmpeg
import requests
from PIL import Image, ImageDraw, ImageFont
import os
from datetime import datetime

# Input from ENV variables
TWEET_TEXT = os.getenv("TWEET_TEXT", "This is a sample TikTok video!")
USER_NAME = os.getenv("USER_NAME", "John Doe")
USER_HANDLE = os.getenv("USER_HANDLE", "@johndoe")
PROFILE_URL = os.getenv(
    "PROFILE_URL",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png/220px-Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png",
)

# Dynamic Output Path
OUTPUT_DIR = "Repurposepro"
os.makedirs(OUTPUT_DIR, exist_ok=True)


# Generate dynamic output file name
def get_output_video_name(username):
    current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    return f"{username}_{current_time}.mp4"

OUTPUT_VIDEO = get_output_video_name(USER_NAME)
OUTPUT_IMAGE = "temp_image.png"


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
    fetch_profile_picture(PROFILE_URL, "profile.jpg")
    profile_img = Image.open("profile.jpg").resize(profile_size)

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
    create_image()
    generate_video()
    print(f"Video generated successfully: {OUTPUT_VIDEO}")
