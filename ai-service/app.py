
from flask import Flask, jsonify
from routes.health_routes import health_bp


def create_app():

    app = Flask(__name__)

    app.register_blueprint(health_bp)

    @app.route("/", methods=["GET"])
    def home():

        return jsonify({
            "application": "MediSense",
            "service": "AI Microservice",
            "message": "AI service is running"
        })

    @app.errorhandler(404)
    def not_found(error):

        return jsonify({
            "success": False,
            "message": "Endpoint not found"
        }), 404

    return app


app = create_app()


if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5001,
        debug=True
    )
