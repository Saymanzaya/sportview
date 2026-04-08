"""SportView backend package.

On AWS Lambda we vendor dependencies inside this package directory, so we add
that folder to ``sys.path``. For local development we avoid that so Windows can
use the normal virtualenv packages instead of Linux wheels bundled for Lambda.
"""

import os
from pathlib import Path
import sys

_PACKAGE_DIR = Path(__file__).resolve().parent
_RUNNING_ON_LAMBDA = bool(
    os.getenv("AWS_EXECUTION_ENV") or os.getenv("LAMBDA_TASK_ROOT")
)

if _RUNNING_ON_LAMBDA and str(_PACKAGE_DIR) not in sys.path:
    sys.path.insert(0, str(_PACKAGE_DIR))
