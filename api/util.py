import os.path
from tinydb import TinyDB
from config import config


def get_param(params, key, default):
    return params[key] if key in params else default


def get_int_param(params, key, default):
    value = int(get_param(params, key, default))
    return value


def param2data(key, params, item, is_int=False):
    if is_int:
        data = get_int_param(params, key, item[key])
    else:
        data = get_param(params, key, item[key])

    return {key: data}


def init_db():
    db_path = os.path.join(config["static_dir"], config["db"])
    db = TinyDB(db_path)
    record = db.all()
    if len(record) == 0:
        db.insert(config["initial_item"])

    return db


def get_image_path(config, id):
    return os.path.join(config["static_dir"], id + ".png")
