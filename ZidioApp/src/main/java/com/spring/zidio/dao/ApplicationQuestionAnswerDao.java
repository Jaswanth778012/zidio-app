package com.spring.zidio.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.Application;
import com.spring.zidio.ApplicationQuestionAnswer;

public interface ApplicationQuestionAnswerDao extends JpaRepository<ApplicationQuestionAnswer, Long> {
    List<ApplicationQuestionAnswer> findByApplication(Application application);
}

