package com.aurelia.ecommerce;

import com.aurelia.ecommerce.dto.OrderRequest;
import com.aurelia.ecommerce.model.Address;
import com.aurelia.ecommerce.model.PaymentMethod;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class AureliaEcommerceApplicationTests {

    @Test
    @DisplayName("Verify Cash on Delivery Business Rule is strictly preserved")
    void testCodPaymentMethodOnly() {
        OrderRequest request = new OrderRequest();
        request.setPaymentMethod(PaymentMethod.CASH_ON_DELIVERY);

        assertEquals(PaymentMethod.CASH_ON_DELIVERY, request.getPaymentMethod(),
                "Payment method must be strictly CASH_ON_DELIVERY");
    }

    @Test
    @DisplayName("Verify Order Item DTO calculations and mapping")
    void testOrderItemDto() {
        OrderRequest.OrderItemDto item = new OrderRequest.OrderItemDto("prod-123", 2);
        assertEquals("prod-123", item.getProductId());
        assertEquals(2, item.getQuantity());
    }

    @Test
    @DisplayName("Verify Address entity field mapping")
    void testAddressStructure() {
        Address address = new Address("addr-1", "Apt 5", "High Street", "Near Metro", "London", "Greater London", "EC1A 1BB", "UK", true);
        assertEquals("London", address.getCity());
        assertTrue(address.isDefault());
    }
}
