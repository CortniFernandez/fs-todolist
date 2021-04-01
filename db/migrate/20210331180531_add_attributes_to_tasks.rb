class AddAttributesToTasks < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :content, :string
    add_column :tasks, :completed, :boolean, default: false
  end
end
