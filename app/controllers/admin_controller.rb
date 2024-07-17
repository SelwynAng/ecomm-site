class AdminController < ApplicationController
  layout 'admin'
  before_action :authenticate_admin!
  before_action :set_current_admin_email

  def index
    @current_admin_email = current_admin.email

    @orders = Order.where(fulfilled: false).order(created_at: :desc).take(5)

    today_start = Time.now.beginning_of_day
    week_start = 1.week.ago.beginning_of_day
    month_start = 1.month.ago.beginning_of_day

    @quick_stats = {
      today_sales: Order.where(created_at: today_start..Time.now).count,
      today_revenue: Order.where(created_at: today_start..Time.now).sum(:total)&.round(),
      weekly_sales: Order.where(created_at: week_start..Time.now).count,
      weekly_revenue: Order.where(created_at: week_start..Time.now).sum(:total)&.round(),
      monthly_sales: Order.where(created_at: month_start..Time.now).count,
      monthly_revenue: Order.where(created_at: month_start..Time.now).sum(:total)&.round(),
    }

    week_start_date = week_start.to_date
    month_start_date = month_start.to_date
    end_date = Date.today

    # Calculate revenue by day for the last week with missing dates filled in
    dates_last_week = (week_start_date..end_date).to_a
    orders_last_week = Order.where(created_at: week_start..Time.now)
    grouped_orders_by_day_week = orders_last_week.group_by { |order| order.created_at.to_date }

    revenue_by_day_last_week = dates_last_week.map do |date|
      [date, grouped_orders_by_day_week.fetch(date, []).sum(&:total)]
    end

    @revenue_by_day_past_week = revenue_by_day_last_week.map { |date, revenue| [date, revenue] }

    # Calculate revenue by day for the last month with missing dates filled in
    dates_last_month = (month_start_date..end_date).to_a
    orders_last_month = Order.where(created_at: month_start..Time.now)
    grouped_orders_by_day_month = orders_last_month.group_by { |order| order.created_at.to_date }

    revenue_by_day_last_month = dates_last_month.map do |date|
      [date, grouped_orders_by_day_month.fetch(date, []).sum(&:total)]
    end

    @revenue_by_day_past_month = revenue_by_day_last_month.map { |date, revenue| [date, revenue] }
  end

  private
    def set_current_admin_email
      @current_admin_email = current_admin.email if current_admin.present?
    end
end
