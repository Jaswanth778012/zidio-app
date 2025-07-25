package com.spring.zidio.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.zidio.Course;
import com.spring.zidio.CourseProgress;
import com.spring.zidio.User;
import com.spring.zidio.VideoContent;
import com.spring.zidio.WatchedVideo;
import com.spring.zidio.dao.CourseProgressDao;
import com.spring.zidio.dao.WatchedVideoDao;

@Service
public class CourseProgressService {
	@Autowired
	private CourseProgressDao courseProgressDao;
	@Autowired
	private WatchedVideoDao watchedVideoRepo;
	
	 public CourseProgress save(CourseProgress progress) {
	        return courseProgressDao.save(progress);
	    }

	    public List<CourseProgress> getByUsername(String username) {
	        return courseProgressDao.findByStudentUserName(username);
	    }

	    public List<CourseProgress> getByCourseId(Long courseId) {
	        return courseProgressDao.findByCourseId(courseId);
	    }

	    public List<CourseProgress> getByVideoId(Long videoId) {
	        return courseProgressDao.findByVideoId(videoId);
	    }

	    public CourseProgress getByStudentAndVideo(User student, VideoContent video) {
	        return courseProgressDao.findByStudentAndVideo(student, video);
	    }

	    public CourseProgress getByStudentAndCourse(User student, Course course) {
	        return courseProgressDao.findByStudentAndCourse(student, course);
	    }

	    public void delete(Long id) {
	        courseProgressDao.deleteById(id);
	    }
	    
	    public void markVideoAsWatched(User student, Course course, VideoContent video) {
	        boolean alreadyWatched = watchedVideoRepo.existsByStudentAndCourseAndVideo(student, course, video);

	        if (!alreadyWatched) {
	            WatchedVideo watched = new WatchedVideo();
	            watched.setStudent(student);
	            watched.setCourse(course);
	            watched.setVideo(video);
	            watched.setWatchedAt(LocalDateTime.now());

	            watchedVideoRepo.save(watched);
	        }
	    }

	    // Method 2: Get list of watched video IDs
	    public Set<Long> getWatchedVideoIds(User student, Course course) {
	        return watchedVideoRepo.findWatchedVideoIds(student, course);
	    }

}
