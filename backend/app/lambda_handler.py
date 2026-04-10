from mangum import Mangum
from .main import app

handler = Mangum(app, lifespan="off", api_gateway_base_path="/prod")