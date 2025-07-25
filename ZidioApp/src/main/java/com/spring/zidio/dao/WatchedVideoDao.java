package com.spring.zidio.dao;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.spring.zidio.Course;
import com.spring.zidio.User;
import com.spring.zidio.VideoContent;
import com.spring.zidio.WatchedVideo;

public interface WatchedVideoDao extends JpaRepository<WatchedVideo, Long> {

    boolean existsByStudentAndCourseAndVideo(User student, Course course, VideoContent video);

    @Query("SELECT w.video.id FROM WatchedVideo w WHERE w.student = :student AND w.course = :course")
    Set<Long> findWatchedVideoIds(@Param("student") User student, @Param("course") Course course);
}
