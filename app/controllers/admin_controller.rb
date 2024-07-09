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

    @orders_by_day = Order.where('created_at > ?', Time.now - 7.days).order(:created_at)
    @orders_by_day = @orders_by_day.group_by { |order| order.created_at.to_date }
    @revenue_by_day = @orders_by_day.map { |day, orders| [day.strftime("%A"), orders.sum(&:total)] }

    if @revenue_by_day.count < 7
      days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

      data_hash = @revenue_by_day.to_h
      current_day = Date.today.strftime("%A")
      current_day_index = days_of_week.index(current_day)
      next_day_index = (current_day_index + 1) % days_of_week.length

      ordered_days_with_current_last = days_of_week[next_day_index..-1] + days_of_week[0...next_day_index]

      complete_ordered_array_with_current_last = ordered_days_with_current_last.map{ |day| [day, data_hash.fetch(day, 0)] }

      @revenue_by_day = complete_ordered_array_with_current_last
    end
  end

  private
    def set_current_admin_email
      @current_admin_email = current_admin.email if current_admin.present?
    end
end
