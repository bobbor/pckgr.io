# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
# http_path = "Resources"
css_dir = "style"
sass_dir = "sass"
images_dir = "icons"
javascripts_dir = "js"

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed
# output_style = :expanded
output_style = (environment == :production) ? :compressed : :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = (environment != :production)

sass_options =  { :debug_info => (environment != :production) }
# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
preferred_syntax = :scss
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
