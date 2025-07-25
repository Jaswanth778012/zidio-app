package com.spring.zidio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.spring.zidio.VideoContent;
import com.spring.zidio.dao.VideoContentDao;

@Service
public class VideoContentService {
	@Autowired
	private VideoContentDao videoContentDao;
	
	public VideoContent create(VideoContent video) {
        return videoContentDao.save(video);
    }

    public List<VideoContent> getBySyllabusId(Long syllabusId) {
        return videoContentDao.findBySyllabusId(syllabusId);
    }

    public VideoContent getById(Long id) {
        return videoContentDao.findById(id).orElse(null);
    }

    public void delete(Long id) {
        videoContentDao.deleteById(id);
    }

    public VideoContent update(VideoContent video) {
        return videoContentDao.save(video);
    }
    

	
}
