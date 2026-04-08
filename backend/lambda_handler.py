try:
    from mangum import Mangum
except ImportError:
    from package.mangum import Mangum

from package.main import app

handler = Mangum(app, lifespan="off")
