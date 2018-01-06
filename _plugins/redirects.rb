module JekyllRedirectFrom
  class Generator < Jekyll::Generator
    safe true
    attr_reader :site, :redirects

    def generate(site)
      @site = site
      @redirects = {}

      # Inject our layout, unless the user has already specified a redirect layout'
      unless site.layouts.keys.any? { |name| name == "redirect" }
        site.layouts["redirect"] = JekyllRedirectFrom::Layout.new(site)
      end

      # Must duplicate pages to modify while in loop
      (site.docs_to_write + site.pages.dup).each do |doc|
        next unless JekyllRedirectFrom::CLASSES.include?(doc.class)
        generate_redirect_from(doc)
        generate_redirect_to(doc)
      end

      generate_redirects_json
      generate_redirects_netlify
    end

    private
    def generate_redirects_netlify
      netlify = site.in_source_dir("_redirects")
      page = PageWithoutAFile.new(site, "", "", "_redirects")
      page.content = File.exist?(netlify) ? File.read(netlify) + "\n" : ''
      page.content << "# ↓ generated by jekyll-redirect-from netlify plugin\n"
      redirects.each { |k, v| page.content << "#{k} #{v}\n" }
      page.data["layout"] = nil
      site.pages << page
    end
  end
end