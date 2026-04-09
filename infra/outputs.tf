output "lambda_function_name" {
  value = aws_lambda_function.backend.function_name
}

output "api_gateway_url" {
  value = aws_apigatewayv2_stage.prod.invoke_url
}