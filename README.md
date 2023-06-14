# fjord.style

Internet web site source code for [http://fjord.style](http://fjord.style).

# Building and Testing a Jekyll Site Locally

If you have a Jekyll site and want to build and test it locally before deployment, follow these steps:

## Prerequisites
- Make sure you have Jekyll installed on your computer. You can check if Jekyll is installed by running the following command in your terminal or command prompt:
   ```
   jekyll -v
   ```

   If Jekyll is not installed, you can install it using RubyGems by running:
   ```
   gem install jekyll bundler
   ```

## Running the Jekyll Site Locally
1. Navigate to the root directory of your Jekyll site using the terminal or command prompt.

2. Run the following command to install the necessary dependencies specified in the `Gemfile`:
   ```
   bundle install
   ```

3. Once the dependencies are installed, you can build and serve your Jekyll site by running the following command:
   ```
   bundle exec jekyll serve
   ```

   This command builds your Jekyll site and starts a local development server.

4. After running the command, you should see output similar to the following:
   ```
   Server address: http://127.0.0.1:4000/
   Server running... press ctrl-c to stop.
   ```

   Your Jekyll site is now being served locally. You can open a web browser and visit `http://127.0.0.1:4000/` or `http://localhost:4000/` to view your site.

   As you make changes to your Jekyll site's files (Markdown files, layouts, stylesheets, etc.), Jekyll will automatically regenerate the site, and you can see the updates by refreshing the page in your browser.

Note that Jekyll requires Ruby to be installed on your computer. Ensure that Ruby is installed and properly configured before following the steps above.
