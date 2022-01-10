import logging
import json
import os
import uuid

from flask import Flask, send_file, request, abort
from flask_cors import CORS
from tinydb import Query
from PIL import Image

from config import config
import img
import util


app = Flask(__name__)
if not app.debug:
    logging.basicConfig(level=logging.INFO)
CORS(app)

# db = util.init_db()


@app.route('/api/items', methods=['GET'])
def api_items():
    db = util.init_db()
    data = db.all()
    db.close()
    return json.dumps(data)


@app.route('/api/img', methods=['POST'])
def api_img():
    response = None
    params = request.form
    data = {}

    item_id = util.get_param(params, "id", None)
    if item_id:
        db = util.init_db()
        q = Query()
        item = db.search(q.id == item_id)
        db.close()
        if len(item) != 0:
            item = item[0]
            for key in item:
                data[key] = util.get_param(params, key, item[key])
        else:
            abort(404)
    else:
        data = params

    image_file = util.get_param(request.files, "image", None)
    if image_file:
        image = Image.open(image_file)
    else:
        img_path = util.get_image_path(config, data["id"])
        image = Image.open(img_path)

    img_file = img.make(data, image, config, app.logger)
    response = send_file(img_file, attachment_filename="image", as_attachment=True)

    if response is None:
        abort(400)

    image_size = image.size
    response.headers["Access-Control-Expose-Headers"] = "image-width, image-height"
    response.headers["image-width"] = image_size[0]
    response.headers["image-height"] = image_size[1]

    return response


@app.route('/api/save', methods=['POST'])
def api_save():
    params = request.form

    data = {}
    for key in config["initial_item"]:
        if key not in params:
            abort(400)
        data[key] = params[key]

    if data["id"] == "":
        data["id"] = str(uuid.uuid4())

    image_file = util.get_param(request.files, "image", None)
    if image_file:
        image = Image.open(image_file)
        filename = util.get_image_path(config, data["id"])
        image.save(filename, "png")
    else:
        abort(400)

    db = util.init_db()
    q = Query()
    db.upsert(data, q.id == data["id"])
    db.close()

    return "OK"


@app.route('/api/delete', methods=['POST'])
def api_delete():
    if "id" not in request.json:
        abort(400)

    item_id = request.json["id"]
    q = Query()
    db = util.init_db()
    db.remove(q.id == item_id)
    db.close()

    image_path = os.path.join(config["static_dir"], item_id + ".png")
    os.remove(image_path)

    return "OK"


if __name__ == '__main__':
    app.run()
