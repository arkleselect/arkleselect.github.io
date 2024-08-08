require 'rake'

SOURCE = "."
CONFIG = {
  'posts' => File.join(SOURCE, "_posts"),
  'post_ext' => "md",
}

# Usage: rake post title="A Title" subtitle="A Subtitle" description="A Description" image="path/to/image" optimized_image="Optimized Image" category="Category" tags="tag1,tag2" author="Author"
desc "Create a new post in #{CONFIG['posts']}"
task :post do
  abort("rake aborted: '#{CONFIG['posts']}' directory not found.") unless FileTest.directory?(CONFIG['posts'])
  
  title = ENV["title"] || "New Post"
  subtitle = ENV["subtitle"] || ""
  description = ENV["description"] || ""
  image = ENV["image"] || ""
  optimized_image = ENV["optimized_image"] || ""
  category = ENV["category"] || ""
  tags = ENV["tags"] ? ENV["tags"].split(',') : []
  author = ENV["author"] || "wpprqi"

  slug = title.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
  filename = File.join(CONFIG['posts'], "#{Time.now.strftime('%Y-%m-%d')}-#{slug}.#{CONFIG['post_ext']}")
  
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end

  puts "Creating new post: #{filename}"

  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M:%S')}"
    post.puts "layout: post"
    post.puts "title: \"#{title}\""
    post.puts "subtitle: \"#{subtitle}\""
    post.puts "description: \"#{description}\""
    post.puts "image: #{image}"
    post.puts "optimized_image: #{optimized_image}"
    post.puts "category: #{category}"
    post.puts "tags:"
    tags.each { |tag| post.puts "  - #{tag}" }
    post.puts "author: #{author}"
    post.puts "---"
    post.puts
    post.puts "Your content goes here."
  end
end
