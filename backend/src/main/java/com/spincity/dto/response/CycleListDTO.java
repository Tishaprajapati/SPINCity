package com.spincity.dto.response;

import lombok.Getter;
import lombok.Setter;

public class CycleListDTO {
    @Getter
    @Setter


        private Long cycleId;

        public Long getCycleId() {
            return cycleId;
        }

        public void setCycleId(Long cycleId) {
            this.cycleId = cycleId;
        }

        public String getCycleName() {
            return cycleName;
        }

        public void setCycleName(String cycleName) {
            this.cycleName = cycleName;
        }

        public String getCycleBrand() {
            return cycleBrand;
        }

        public void setCycleBrand(String cycleBrand) {
            this.cycleBrand = cycleBrand;
        }

        public String getCycleModel() {
            return cycleModel;
        }

        public void setCycleModel(String cycleModel) {
            this.cycleModel = cycleModel;
        }

        public String getCycleType() {
            return cycleType;
        }

        public void setCycleType(String cycleType) {
            this.cycleType = cycleType;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        private String cycleName;
        private String cycleBrand;
        private String cycleModel;
        private String cycleType;
        private String status;
    // ✅ ADD THESE FIELDS
    private String point1;

    public String getPoint1() {
        return point1;
    }

    public void setPoint1(String point1) {
        this.point1 = point1;
    }

    public String getPoint2() {
        return point2;
    }

    public void setPoint2(String point2) {
        this.point2 = point2;
    }

    public String getPoint3() {
        return point3;
    }

    public void setPoint3(String point3) {
        this.point3 = point3;
    }

    public String getPoint4() {
        return point4;
    }

    public void setPoint4(String point4) {
        this.point4 = point4;
    }

    public String getPoint5() {
        return point5;
    }

    public void setPoint5(String point5) {
        this.point5 = point5;
    }

    public Double getPricePerHour() {
        return pricePerHour;
    }

    public void setPricePerHour(Double pricePerHour) {
        this.pricePerHour = pricePerHour;
    }

    public Double getDailyPrice() {
        return dailyPrice;
    }

    public void setDailyPrice(Double dailyPrice) {
        this.dailyPrice = dailyPrice;
    }

    public Double getWeeklyPrice() {
        return weeklyPrice;
    }

    public void setWeeklyPrice(Double weeklyPrice) {
        this.weeklyPrice = weeklyPrice;
    }

    public Double getMonthlyPrice() {
        return monthlyPrice;
    }

    public void setMonthlyPrice(Double monthlyPrice) {
        this.monthlyPrice = monthlyPrice;
    }

    private Double pricePerHour;
    private Double dailyPrice;
    private Double weeklyPrice;
    private Double monthlyPrice;
    private String point2;
    private String point3;
    private String point4;
    private String point5;
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    private String imageUrl;

}
