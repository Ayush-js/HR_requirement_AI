package com.hrgenai.hr_genai_backend.service.impl;

import com.hrgenai.hr_genai_backend.dto.request.LoginRequest;
import com.hrgenai.hr_genai_backend.dto.request.RegisterRequest;
import com.hrgenai.hr_genai_backend.dto.response.AuthResponse;
import com.hrgenai.hr_genai_backend.model.User;
import com.hrgenai.hr_genai_backend.repository.AppraisalRepository;
import com.hrgenai.hr_genai_backend.repository.CandidateRepository;
import com.hrgenai.hr_genai_backend.repository.OfferLetterRepository;
import com.hrgenai.hr_genai_backend.repository.PolicyDocumentRepository;
import com.hrgenai.hr_genai_backend.repository.UserRepository;
import com.hrgenai.hr_genai_backend.service.AuthService;
import com.hrgenai.hr_genai_backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;



import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CandidateRepository candidateRepository;
private final AppraisalRepository appraisalRepository;
private final OfferLetterRepository offerLetterRepository;
private final PolicyDocumentRepository policyDocumentRepository;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    @Override
public List<Map<String, Object>> getAllUsers() {
    return userRepository.findAll().stream()
            .map(u -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", u.getId());
                map.put("name", u.getName());
                map.put("email", u.getEmail());
                map.put("role", u.getRole());
                map.put("isActive", u.getIsActive());
                return map;
            })
            .collect(java.util.stream.Collectors.toList());
}

@Override
public Map<String, Object> getStats() {
    Map<String, Object> stats = new HashMap<>();
    stats.put("totalCandidates", candidateRepository.count());
    stats.put("totalAppraisals", appraisalRepository.count());
    stats.put("totalOffers", offerLetterRepository.count());
    stats.put("totalPolicies", policyDocumentRepository.count());
    stats.put("totalUsers", userRepository.count());
    return stats;
}
}