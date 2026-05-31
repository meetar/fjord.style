# fjord.style

Internet web site source code for [http://fjord.style](http://fjord.style).

# Building and Testing a Jekyll Site Locally

If you have a Jekyll site and want to build and test it locally before deployment, follow these steps:

## Prerequisites
- Make sure Ruby is installed on your computer:
   ```sh
   ruby -v
   ```

- Then make sure Bundler is installed. If not, install it in your user gem directory:
   ```sh
   gem install --user-install bundler
   ```

  This site does not require a global Jekyll install. `bundle install` installs the Jekyll version specified by the `Gemfile`.

## Running the Jekyll Site Locally
1. Navigate to the root directory of this site:
   ```sh
   cd fjord.style
   ```

2. Configure Bundler to install gems inside the project, then install the dependencies specified in the `Gemfile`:
   ```sh
   bundle config set path vendor/bundle
   bundle install
   ```

3. Once the dependencies are installed, build and serve the site:
   ```sh
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
