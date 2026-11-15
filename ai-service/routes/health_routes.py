
from flask import Blueprint, jsonify
from datetime import datetime, timezone

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health_check():

    return jsonify({
        "success": True,
        "service": "MediSense AI Service",
        "status": "running",
        "modelStatus": "not_loaded",
        "timestamp": datetime.now(
            timezone.utc
        ).isoformat()
    }), 200
