package com.spring.zidio.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {
	
	@Autowired
	private Cloudinary cloudinary;
	
	public String uploadFile(MultipartFile file) {
		try {
			Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
			return  uploadResult.get("url").toString();
		} catch (Exception e) {
			throw new RuntimeException("Failed to upload file", e);
		}
	}
	
	public String uploadprofile(MultipartFile file, String folder){
		try {
			Map uploadprofile = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", folder));
			return uploadprofile.get("url").toString();
		}catch (Exception e) {
			throw new RuntimeException("Failed to upload profile image", e);
		}
	}
	
	public String uploadLogo(MultipartFile file, String folder) {
		try {
			Map uploadLogo = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", folder));
			return uploadLogo.get("url").toString();
		} catch (Exception e) {
			throw new RuntimeException("Failed to upload logo", e);
		}
	}
	
	public String uploadInternshipLogo(MultipartFile file, String folder) {
		try {
			Map uploadInternshipLogo = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", folder));
			return uploadInternshipLogo.get("url").toString();
		} catch (Exception e) {
			throw new RuntimeException("Failed to upload internship logo", e);
		}
	}
	
	public String uploadresume(MultipartFile file, String folder) {
		try {
			Map uploadResume = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", folder,"resource_type", "auto",
		            "type", "upload"));
			return uploadResume.get("url").toString();
		} catch (Exception e) {
			throw new RuntimeException("Failed to upload resume", e);
		}
	}
	
	public Map uploadVideo(MultipartFile file, String folder) {
	    try {
	        return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
	            "folder", folder,
	            "resource_type", "video"
	        ));
	    } catch (Exception e) {
	        throw new RuntimeException("Failed to upload video", e);
	    }
	}
	public String uploadteamphoto(MultipartFile file, String folder) {
		try {
			Map uploadteamphoto = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", folder));
			return uploadteamphoto.get("url").toString();
		} catch (Exception e) {
			throw new RuntimeException("Failed to upload logo", e);
		}
	}
	
	public String reportissue(MultipartFile file, String folder) {
		try {
			Map uploadteamphoto = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", folder));
			return uploadteamphoto.get("url").toString();
		} catch (Exception e) {
			throw new RuntimeException("Failed to upload logo", e);
		}
	}
}
