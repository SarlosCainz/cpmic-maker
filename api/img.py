import io
import os.path

from PIL import ImageDraw, ImageFont


def make(data, image, config, logger):
    image_size = image.size
    width = config["img_width"]
    height = int(width * image.size[1] / image.size[0])
    image = image.resize((width, height))

    draw = ImageDraw.ImageDraw(image)

    font_path = os.path.join(config["static_dir"], config["font"])
    font_size = int(data["font_size"])
    draw.font = ImageFont.truetype(font_path, font_size)

    lines = data["quote"].splitlines()
    x = int(data["quote_x"]) + len(lines) * (font_size * 0.6)
    y = int(data["quote_y"])

    for line in lines:
        draw.text((x, y), line, fill="black", direction="ttb")
        x -= font_size + 4

    file = io.BytesIO()
    image.save(file, "png")
    file.seek(0)

    return file
