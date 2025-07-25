package com.spring.zidio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "images")
public class ImageModel {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	private String imageName;
	private String type;
	private String url;
	@Column(length = 50000000)
	private byte[] picByte;
	
	public ImageModel() {
		
	}
	public ImageModel(String imageName, String type, String url) {
		this.imageName = imageName;
		this.type = type;
		this.url = url;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getImageName() {
		return imageName;
	}
	public void setImageName(String imageName) {
		this.imageName = imageName;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public byte[] getPicByte() {
		return picByte;
	}
	public void setPicByte(byte[] picByte) {
		this.picByte = picByte;
	}
	
}
