package com.spincity.dto.response;
public class AdminDashboardSummaryDTO {

    private long totalCustomers;
    private long totalStaff;

    private long activeCycles;

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalStaff() {
        return totalStaff;
    }

    public void setTotalStaff(long totalStaff) {
        this.totalStaff = totalStaff;
    }

    public long getActiveCycles() {
        return activeCycles;
    }

    public void setActiveCycles(long activeCycles) {
        this.activeCycles = activeCycles;
    }

    public long getInactiveCycles() {
        return inactiveCycles;
    }

    public void setInactiveCycles(long inactiveCycles) {
        this.inactiveCycles = inactiveCycles;
    }

    public long getActiveStations() {
        return activeStations;
    }

    public void setActiveStations(long activeStations) {
        System.out.println("setActivestaions from admin dashboard dto called");
        this.activeStations = activeStations;
    }

    public long getInactiveStations() {
        return inactiveStations;
    }

    public void setInactiveStations(long inactiveStations) {
        this.inactiveStations = inactiveStations;
    }

    public double getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(double todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    private long inactiveCycles;

    private long activeStations;
    private long inactiveStations;

    private double todayRevenue;

}