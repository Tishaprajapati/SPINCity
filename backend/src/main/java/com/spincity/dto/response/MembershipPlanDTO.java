package com.spincity.dto.response;

public class MembershipPlanDTO {

    private Long id;

    public void setId(Long id) {
        this.id = id;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public void setDurationInDays(Integer durationInDays) {
        this.durationInDays = durationInDays;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    private String planName;
    private Integer durationInDays;
    private Double price;

    public MembershipPlanDTO() {}

    public MembershipPlanDTO(Long id, String planName, Integer durationInDays, Double price) {
        this.id = id;
        this.planName = planName;
        this.durationInDays = durationInDays;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public String getPlanName() {
        return planName;
    }

    public Integer getDurationInDays() {
        return durationInDays;
    }

    public Double getPrice() {
        return price;
    }
}
