class AdminController < ApplicationController
  layout 'admin'
  before_action :authenticate_admin!

  def index
    @current_admin_email = current_admin.email
    @orders = Order.where(fulfilled: false).order(created_at: :desc).take(5)
    @quick_stats = {
      sales: Order.where(created_at: Time.now.midnight..Time.now).count,
      revenue: Order.where(created_at: Time.now.midnight..Time.now).sum(:total).round(),
      avg_sale: Order.where(created_at: Time.now.midnight..Time.now).average(:total).round(),
      per_sale: OrderProduct.joins(:order).where(orders: { created_at: Time.now.midnight..Time.now}).average(:quantity)
    }
    @orders_by_day = Order.where('created_at > ?', Time.now - 7.days).order(:created_at)
    @orders_by_day = @orders_by_day.group_by { |order| order.created_at.to_date }
    @revenue_by_day = @orders_by_day.map { |day, orders| [day.strftime("%A"), orders.sum(&:total)] }
  end
end
