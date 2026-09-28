package com.aurelia.ecommerce.init;

import com.aurelia.ecommerce.model.*;
import com.aurelia.ecommerce.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    @Value("${app.seed.admin-password:Admin@12345}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        if (!seedEnabled) {
            return;
        }

        logger.info("Initializing Aurelia Botanica database seed data...");

        // 1. Seed Admin User
        if (!userRepository.existsByEmail("admin@aurelia.com")) {
            User admin = new User("Aurelia Administrator", "admin@aurelia.com", passwordEncoder.encode(adminPassword), "+1-555-0199");
            admin.setRoles(new HashSet<>(Arrays.asList(Role.ROLE_ADMIN, Role.ROLE_USER)));
            userRepository.save(admin);
            logger.info("Created development admin: admin@aurelia.com");
        }

        // 2. Seed Customer User
        if (!userRepository.existsByEmail("customer@aurelia.com")) {
            User customer = new User("Elena Vance", "customer@aurelia.com", passwordEncoder.encode("Customer@12345"), "+1-555-0188");
            Address addr = new Address("addr-1", "Apt 4B, The Pavilion", "Rue de la Paix", "Near Royal Gardens", "Paris", "Ile-de-France", "75001", "France", true);
            customer.getAddresses().add(addr);
            userRepository.save(customer);
            logger.info("Created development customer: customer@aurelia.com");
        }

        // 3. Seed Categories
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category("Face Elixirs & Serums", "face-elixirs-serums", "Potent botanical extracts and cold-pressed facial oils.", "/src/assets/images/product_rose_face_elixir_1790592668403.jpg"));
            categoryRepository.save(new Category("Restorative Cremes", "restorative-cremes", "Decadent night treatments and rich moisture barriers.", "/src/assets/images/product_velvet_plum_creme_1790592680430.jpg"));
            categoryRepository.save(new Category("Artisanal Candles", "artisanal-candles", "Hand-poured slow burning vegetable wax infused with rare botanicals.", "/src/assets/images/product_champagne_candle_1790592691479.jpg"));
            categoryRepository.save(new Category("Haute Body Care", "haute-body-care", "Exfoliating polishes and silk-finish body hydrators.", "/src/assets/images/product_silk_body_polish_1790592704847.jpg"));
        }

        // 4. Seed Coupons
        if (couponRepository.count() == 0) {
            Coupon welcomeCoupon = new Coupon("WELCOME10", "10% off for first-time orders", Coupon.DiscountType.PERCENTAGE, 10.0, 500.0, 500.0, Instant.now().plus(90, ChronoUnit.DAYS), 5000);
            couponRepository.save(welcomeCoupon);

            Coupon luxuryFlat = new Coupon("AURELIA50", "$50 flat discount on orders over $300", Coupon.DiscountType.FIXED, 50.0, 300.0, null, Instant.now().plus(60, ChronoUnit.DAYS), 1000);
            couponRepository.save(luxuryFlat);
        }

        logger.info("Database seed initialization completed successfully.");
    }
}
