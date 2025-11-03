# hexo-theme-butterfly (forked)

![hexo-theme-butterfly version](https://img.shields.io/github/package-json/v/jerryc127/hexo-theme-butterfly/dev?label=dev)
![hexo version](https://img.shields.io/badge/hexo-5.3.0+-0e83cd)


## Changed to Multilingual (Check commits from 2024-04-19 to 2024-04-20)
>In my blog, the basic goal was to make English and Korean cross-support possible.<br>
> So I used the 'hexo-generator-i18n' plug-in.<br>

> In addition, many scripts using '_p()' have been modified to make the default language page (e.g., about.html) common to all languages.<br>

> By doing this, **posts set in the 'default' language can alternately display both languages** through the right side button, and furthermore, **they are accessible to all archive/tags/categories regardless of language**.

### install generators for multilingual pages
```bash
npm install hexo-generator-i18n --save
```

### add i18n-related files in `scripts` directory
- get `i18n.js`, `rfc5646.js`, and `10_i18n.js` files from [hexo-theme-minos](https://github.com/ppoffice/hexo-theme-minos)'.
- Then add the three files into `butterfly/layout/includes/scripts`.<br>I add directory name `custom_helpers` to distinguish with original files.
- In `10_i18n.js`, `categories()` and `tags()` helpers should be all comment out since the functions don't work in this theme.
- Instead, I made `tagclouds()` and `list_categories()` helpers by referring to the two.
- Therefore, the final file structure is as follows:
```
...
├── scripts/
│   ├── custom_helpers
│   │   ├── 10_i18n.js  # from hexo-theme-minos (except categories() and tags() helpers)
│   │   ├── i18n.js     # from hexo-theme-minos 
│   │   │                 (i've changed isDefaultLanguage() and getDisplayLanguage() a little bit)
│   │   ├── listcategories.js
│   │   ├── rfc5646.js  # from hexo-theme-minos
│   │   └── tagcloud.js
...
```


### change the following to _config.yml
- Can use more than two languages though I used two.

```yaml
language: 
  - default
  - en
  - ko
language_default: default
i18n_dir: :lang
i18n: # hexo-generator-i18n settings
  type:
    # - page  # if active, then page_title, ko/page_title, en/page_title are all available with the same content
    # - post  # if active, then posts/:title, en/posts/:title, ko/posts/:title are all avaliable (this is not recommended since :title already contains language information)
  generator:  # all inactive since every helpers is defined in 10_i18n.js
    # - archive
    # - category
    # - tag
    # - index
```


### add default.yml, en.yml, and ko.yml in `languages` directory
- `default.yml` should contains all languages as the first level key.
- I copied and pasted the contents of `en.yml` and `ko.yml` to `default.yml`.<br>Then, added the `en` and `ko` keys in the first level.


### add the language as prefix to the `_p()` function's parameter
- In this theme, the `_p()` function is used to get the language-specific content.
- Since I want to use all language contents in the default language page, I added the language as prefix to the parameter of `_p()` function.
- For instance, if it had previously been written as `_p('page_title')`, then I changed it to `_p('en.page.title')` and `_p('ko.page.title')` when the language is set to default.
- In this way, the default language page can display both languages alternately if click the language transition button.
- It was a lot of work since i never studied js, pug, and any other front-end languages before.
- So the code might be a little bit messy, but it works pretty well. (maybe haha)


### add html attributes to the language related tags
- In the theme, the language-related tags are used to display the language-specific content.
- For instance, `div` is changed to `div(div(lang-type='relative' language='en')` when the content is written in English.


### change search db generator to support multilingual
- I use LocalSearch in my blog, so I changed the `source/js/search/local-search.js` to support multilingual.
- Since the language information is initially not in `hexo-generator-searchdb` library, 
  <br>I added the language information to the search DB.
  <br>(`source/js/custom/hexo-generator-searchdb-custom`)
- The search result is displayed in the alternative language when the language is changed
- Also, I add tags and categories to be searched
  - The search result is sorted with weighted score of match count 
    <br>(1000: language > 3: title > 2: categories, tags > 1: content)


### change all GLOBAL_CONFIG _p() into multilingual
- In the theme, the `GLOBAL_CONFIG` is used to store the global variables that is used in the js during runtime.
- I changed all the `GLOBAL_CONFIG` variables and related functions to support multilingual.
- The changed files are below:
  - `layout/includes/head/config.pug`
  - `layout/includes/mixins/post-ui.pug`
  - `layout/includes/third-party/search/*`
  - `source/js/search/algolia.js`
  - `source/js/custom/hexo-generator-searchdb-custom/dist/local-search.js`
    - This is the cusomized version of `source/js/search/local-search.js`
  - `source/js/custom/change_lang.js`
  - `source/js/utils.js` (change diffDate() to support multilingual)
  - `source/js/main.js` (change all the text that using GLOBAL_CONFIG to support multilingual)


## RESULT : Change the following features to support multilingual
- [x] Archive Length Helper (`findArchiveLength.js`)
  - Get archive length in multilingual manner
  - For example, the posts in Korean will be dropped when the page language is set to English.
- [x] Language Transition Button on rightside (`change_lang.js`, ...)
  - If the page language is set to default, then the button changes the text language alternately.
  - If the page language is set to specific language, then the site will be redirected to the same page in the alternative language.
- [x] Tag Cloud Helper (`tagcloud.js`)
  - `/en/tags/` and `/ko/tags/` are available
- [x] List Categories Helper (`listcategories.js`)
  - `/en/categories/` and `/ko/categories/` are available
- [x] Menu and Navigation
  - Some site url changes automatically according to the page language
  - For example, `/en/archive/` changes to `/ko/archive/` when the language is changed
- [x] Index Page with Multilingual Support (see index helper in `10_i18n.js`)
  - `index.html` show all posts
  - `en/index.html` show only English posts
  - `ko/index.html` show only Korean posts
- [X] Aside (Recent Posts, Categories, Tags, Blog Info, Archives) (`aside_categories.js`, `aside_archives.js`, ...)
  - All the aside contents are available in multilingual manner
  - If Language Transition Button is clicked, then the aside contents will be changed to the alternative language
- [X] Search (`source/js/custom/hexo-generator-searchdb-custom`)
  - The search DB is generated in multilingual manner
  - The search result is displayed in the alternative language when the language is changed
  - Also, I add tags and categories to be searched
  - The search result is sorted with weighted score of count (3: title > 2: categories, tags > 1: content)


# Original README.md

<div align="right">
  <a title="中文" href="/README_CN.md">中文</a>
</div>

<div align="center">

<img src="./source/img/butterfly-icon.png" width="150" height="150" alt="Butterfly Logo" />

# hexo-theme-butterfly

A modern, elegant and feature-rich theme for Hexo

![master version](https://img.shields.io/github/package-json/v/jerryc127/hexo-theme-butterfly/master?color=%231ab1ad&label=master)
![dev version](https://img.shields.io/github/package-json/v/jerryc127/hexo-theme-butterfly/dev?label=dev)
![npm version](https://img.shields.io/npm/v/hexo-theme-butterfly?color=%09%23bf00ff)
![hexo version](https://img.shields.io/badge/hexo-5.3.0+-0e83cd)
![license](https://img.shields.io/github/license/jerryc127/hexo-theme-butterfly?color=FF5531)
![GitHub stars](https://img.shields.io/github/stars/jerryc127/hexo-theme-butterfly?style=social)

📢 **Demo**: [Butterfly Official](https://butterfly.js.org/) | [CrazyWong's Blog](https://blog.crazywong.com/)

📖 **Documentation**: [English Docs](https://butterfly.js.org/en/posts/butterfly-docs-en-get-started/) | [中文文档](https://butterfly.js.org/posts/21cfbf15/)

![Butterfly Theme Preview](https://cdn.jsdelivr.net/gh/jerryc127/CDN@m2/img/theme-butterfly-readme.png)

</div>

---

## 🚀 Quick Start

### 💾 Installation

#### Method 1: Git Installation (Recommended)

> 💡 **Tip**: If GitHub access is slow in mainland China, you can use the [Gitee Mirror](https://gitee.com/immyw/hexo-theme-butterfly.git)

Execute in your Hexo blog root directory:

```bash
# Install stable version (recommended)
git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

```bash
# Install development version (early access to new features)
git clone -b dev https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

#### Method 2: NPM Installation

> ⚠️ **Note**: NPM installation only supports Hexo 5.0.0 and above

```bash
npm install hexo-theme-butterfly
```

### ⚙️ Theme Configuration

1. **Enable Theme**: Modify your Hexo configuration file `_config.yml`:

```yaml
theme: butterfly
```

2. **Install Dependencies**: If you haven't installed pug and stylus renderers, please run:

```bash
npm install hexo-renderer-pug hexo-renderer-stylus --save
```

## ✨ Theme Features

### 🎨 Design Style
- [x] **Card-based Design** - Modern card-style layout
- [x] **Rounded/Square Design** - Customizable border styles
- [x] **Responsive Design** - Perfect adaptation to all screen sizes
- [x] **Two-column Layout** - Optimized reading experience
- [x] **Dark Mode** - Eye-friendly night mode

### 📝 Content Features
- [x] **Multi-level Menu** - Support for secondary navigation menus
- [x] **Reading Mode** - Focused article reading experience
- [x] **TOC Navigation** - Desktop and mobile TOC support
- [x] **Word Count** - Display article word count and reading time
- [x] **Related Articles** - Smart recommendation of related content
- [x] **Outdated Reminder** - Automatic article update status alerts
- [x] **Traditional/Simplified Chinese** - Support for Traditional and Simplified Chinese switching
- [x] **Tag Plugins** - Rich tag plugin support

### 🔍 Search & Navigation
- [x] **Multiple Search Options** - Algolia Search / Local Search / Docsearch
- [x] **Built-in 404** - Beautiful 404 error page
- [x] **Pjax Support** - Smooth page transition experience

### 🎨 Code Display
- [x] **Syntax Highlighting** - Built-in multiple themes (darker/pale night/light/ocean)
- [x] **Code Features** - Language display/fold expand/copy button/auto-wrap
- [x] **Math Formulas** - Support for Mathjax and Katex

### 💬 Social Interaction
- [x] **Multiple Comment Systems** - Disqus/Gitalk/Valine/Waline/Twikoo/Giscus/Artalk etc.
- [x] **Dual Comments Support** - Enable two comment systems simultaneously
- [x] **Share Features** - Sharejs/Addtoany sharing components
- [x] **Live Chat** - Chatra/Tidio/Crisp instant messaging

### 📊 Analytics & Statistics
- [x] **Visit Statistics** - Busuanzi counter
- [x] **Site Analytics** - Google Analytics/Baidu Analytics/Cloudflare Analytics/Microsoft Clarity/Umami
- [x] **Webmaster Verification** - Major search engine verification
- [x] **Ad Support** - Google AdSense/custom ad slots

### 🎪 Visual Effects
- [x] **Typing Effects** - activate_power_mode animations
- [x] **Background Effects** - Static ribbons/dynamic ribbons/floating ribbons/Canvas Nest
- [x] **Mouse Effects** - Fireworks/hearts/text click effects
- [x] **Loading Animations** - Preloader and pace.js progress bars
- [x] **Image Effects** - Medium Zoom/Fancybox image lightbox
- [x] **Lazy Loading** - Image lazy loading optimization

### 🛠️ Advanced Features
- [x] **PWA Support** - Progressive Web App
- [x] **Copy Protection** - Disable text copying/copyright info append
- [x] **Theme Customization** - Custom site color schemes
- [x] **Chart Support** - Mermaid flowcharts/Chart.js data charts
- [x] **Music Notation** - ABCJS music notation support
- [x] **Music Player** - APlayer/Meting music playback
- [x] **Article Series** - Series article organization
- [x] **Instantpage** - Page preloading acceleration
- [x] **Snackbar** - Elegant notification messages

## 🤝 Contributors

Thanks to all the developers who have contributed to the Butterfly theme!

[![Contributors](https://contrib.rocks/image?repo=jerryc127/hexo-theme-butterfly)](https://github.com/jerryc127/hexo-theme-butterfly/graphs/contributors)

## 📸 Screenshots

<div align="center">

![Theme Demo](https://cdn.jsdelivr.net/gh/jerryc127/CDN@m2/img/butterfly-readme-screenshots-1.jpg)

![Theme Demo](https://cdn.jsdelivr.net/gh/jerryc127/CDN@m2/img/butterfly-readme-screenshots-2.jpg)

![Theme Demo](https://cdn.jsdelivr.net/gh/jerryc127/CDN@m2/img/butterfly-readme-screenshots-3.jpg)

![Theme Demo](https://cdn.jsdelivr.net/gh/jerryc127/CDN@m2/img/butterfly-readme-screenshots-4.jpg)

</div>


## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=jerryc127/hexo-theme-butterfly&type=Date)](https://star-history.com/#jerryc127/hexo-theme-butterfly&Date)

## 🤝 Building a Better Theme Together

We believe **the power of open source comes from everyone's participation**! Whether you're a developer, designer, or user, you can contribute to the development of the Butterfly theme.

### 💬 Get Help & Support

- 🐛 **Found a bug?** → [GitHub Issues](https://github.com/jerryc127/hexo-theme-butterfly/issues) - Let's solve it together!
- 💡 **Have ideas?** → [GitHub Discussions](https://github.com/jerryc127/hexo-theme-butterfly/discussions) - Share your creative ideas!
- 📚 **Learning to use?** → [Official Documentation](https://butterfly.js.org/) - Detailed usage guide
- 💬 **Real-time discussion?** → [Telegram Group](https://t.me/bu2fly) - Chat with community members

### 🎯 Contributing

Want to make Butterfly better? We welcome any form of contribution:

- **🔧 Code Contributions** - Fix bugs, add new features, optimize performance
- **📝 Documentation** - Improve docs, translate content, write tutorials
- **🎨 Design Suggestions** - UI/UX improvements, theme colors, icon design
- **🧪 Testing & Feedback** - Test new features, report issues, provide user experience
- **💰 Financial Support** - [Sponsor the Project](https://buy.stripe.com/3cs6rP6YA91sbbG5kk) - Support long-term development

## 📄 License

This project is licensed under the [Apache 2.0](LICENSE) License.

## 🙏 Acknowledgments

This theme is developed based on [hexo-theme-melody](https://github.com/Molunerfinn/hexo-theme-melody). Thanks to the original author for their excellent work that provided inspiration and foundation!

Thanks to all friends who have contributed to the development of the Butterfly theme. Your support has made this theme continuously improve and progress.

---

<div align="center">

**✨ If this theme helps you, please give us a ⭐ Star! ✨**
</div>
