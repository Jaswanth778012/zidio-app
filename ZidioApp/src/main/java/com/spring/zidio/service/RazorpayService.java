package com.spring.zidio.service;

import java.math.BigDecimal;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Hex;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;



@Service
public class RazorpayService {
	
	@Value("${razorpay.key_id}")
	private String razorpayKeyId;
	
	@Value("${razorpay.key_secret}")
	private String razorpayKeySecret;
	
	public Order createOrder(BigDecimal amountInRupees, String currency, String receipt) throws Exception {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInRupees.multiply(BigDecimal.valueOf(100)).intValue()); // Convert to paise
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", receipt);
        orderRequest.put("payment_capture", 1);

        return razorpay.orders.create(orderRequest);
    }
	
	public Payment fetchPayment(String paymentId) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        return razorpay.payments.fetch(paymentId);
    }
	
	 public boolean verifyPaymentSignature(String orderId, String paymentId, String razorpaySignature) {
	        try {
	            String payload = orderId + "|" + paymentId;
	            Mac mac = Mac.getInstance("HmacSHA256");
	            SecretKeySpec secretKeySpec = new SecretKeySpec(razorpayKeySecret.getBytes(), "HmacSHA256");
	            mac.init(secretKeySpec);
	            byte[] hash = mac.doFinal(payload.getBytes());
	            String generatedSignature = Hex.encodeHexString(hash);
	            return generatedSignature.equals(razorpaySignature);
	        } catch (Exception e) {
	            e.printStackTrace();
	            return false;
	        }
	    }
}
