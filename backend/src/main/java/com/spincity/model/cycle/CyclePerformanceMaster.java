package com.spincity.model.cycle;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cycle_performance_master")
public class CyclePerformanceMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "performance_id")
    private Integer performanceId;

    @Column(name = "cycle_category")
    private String cycleCategory;

    @Column(name = "point_1")
    private String point1;

    @Column(name = "point_2")
    private String point2;

    @Column(name = "point_3")
    private String point3;

    @Column(name = "point_4")
    private String point4;

    @Column(name = "point_5")
    private String point5;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name="image_path")
    private String imageUrl;

    // Getter and Setter
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    // Getters and Setters
    public Integer getPerformanceId() { return performanceId; }
    public void setPerformanceId(Integer performanceId) { this.performanceId = performanceId; }

    public String getCycleCategory() { return cycleCategory; }
    public void setCycleCategory(String cycleCategory) { this.cycleCategory = cycleCategory; }

    public String getPoint1() { return point1; }
    public void setPoint1(String point1) { this.point1 = point1; }

    public String getPoint2() { return point2; }
    public void setPoint2(String point2) { this.point2 = point2; }

    public String getPoint3() { return point3; }
    public void setPoint3(String point3) { this.point3 = point3; }

    public String getPoint4() { return point4; }
    public void setPoint4(String point4) { this.point4 = point4; }

    public String getPoint5() { return point5; }
    public void setPoint5(String point5) { this.point5 = point5; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}