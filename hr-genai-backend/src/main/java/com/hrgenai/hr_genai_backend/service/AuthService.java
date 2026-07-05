package com.hrgenai.hr_genai_backend.service;

import com.hrgenai.hr_genai_backend.dto.request.LoginRequest;
import com.hrgenai.hr_genai_backend.dto.request.RegisterRequest;
import com.hrgenai.hr_genai_backend.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}