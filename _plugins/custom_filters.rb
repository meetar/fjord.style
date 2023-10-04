module Jekyll
  module CustomFilters
    def exclude_hidden_posts(posts)
      posts.reject { |post| post.data['hidden'] == true }
    end
  end
end

Liquid::Template.register_filter(Jekyll::CustomFilters)