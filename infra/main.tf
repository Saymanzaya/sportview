locals {
  function_name = "${var.project_name}-${var.environment}-backend"
}

resource "aws_iam_role" "lambda_exec_role" {
  name = "${local.function_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "backend" {
  function_name    = local.function_name
  role             = aws_iam_role.lambda_exec_role.arn
  handler          = "package.lambda_handler.handler"
  runtime          = "python3.12"
  filename         = "${path.module}/lambda_build.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda_build.zip")
  timeout          = 30
  memory_size      = 512

  environment {
    variables = {
      TICKETMASTER_KEY = var.ticketmaster_key
      SPORTSDB_API_KEY     = var.sportsdb_api_key
      OPENAI_API_KEY       = var.openai_api_key
      CORS_ORIGINS         = var.cors_origins
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution
  ]
}

resource "aws_apigatewayv2_api" "http_api" {
  name          = "${local.function_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = split(",", var.cors_origins)
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["*"]
  }
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.backend.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "proxy_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = var.environment
  auto_deploy = true
}

resource "aws_lambda_permission" "allow_apigw" {
  statement_id  = "AllowHttpApiInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.backend.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}