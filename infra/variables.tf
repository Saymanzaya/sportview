variable "aws_region" {
  description = "AWS region for SportView backend resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "sportview"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "prod"
}

variable "ticketmaster_key" {
  description = "Ticketmaster API key"
  type        = string
  sensitive   = true
}

variable "sportsdb_api_key" {
  description = "TheSportsDB API key"
  type        = string
  sensitive   = true
}

variable "openai_api_key" {
  description = "OpenAI API key for LLM features"
  type        = string
  sensitive   = true
  default     = ""
}

variable "cors_origins" {
  description = "Allowed CORS origins"
  type        = string
  default     = "http://localhost:5173,https://zayab.d1ngwykof7h55j.amplifyapp.com"
}