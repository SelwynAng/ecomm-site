Rails.application.routes.draw do
  namespace :admin do
    resources :orders
    resources :products do
      resources :stocks
    end
    resources :categories
  end

  devise_for :admins

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "home#index"

  authenticated :admin_user do
    root to: "admin#index", as: :admin_root
  end

  resources :categories, only: [:show]
  resources :products, only: [:show]

  get "admin" => "admin#index"
  get "cart" => "carts#show"

  post "checkout" => "checkout#create"
  get "success" => "checkout#success"
  get "cancel" => "checkout#cancel"
  post "webhook" => "webhooks#stripe"
end
