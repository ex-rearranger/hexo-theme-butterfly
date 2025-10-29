'use strict'

const htmlTag = require('hexo-util').htmlTag.bind(hexo)

/**
* Youtube Advanced Tag
*
* Syntax:
*   {% youtube video_id, options in comma %}
 *   type: video or list (default video)
 *   cookie: true / 1 / false / 0 (default true)
 *   autoplay: true / 1 / false / 0 (default 0)
 *   loop: true / 1 / false / 0 (default 0)
 *   looplist: true / 1 / false / 0 (default same as video_id)
 *   mute: true / 1 / false / 0 (default 0)
 *
*/

function youtubeAdvancedTag(args) {
  args = args.join(' ').split(',');
  const video_id = args[0].trim();
  let type = 'video';
  let cookie = true;
  let loop = false;
  let looplist = video_id;
  let options = [];

  if (args.length > 1) {
    for (let i = 1; i < args.length; i++) {
      let tmp = args[i].trim().split('=');
      if (tmp.length == 1) continue;

      if ((tmp[0].trim() == 'type') && (tmp[1].trim() == 'list')) {
          type = 'list';
      }
      else if ((tmp[0].trim() == 'cookie') && ((tmp[1].trim() == 'false') || (tmp[1].trim() == '0'))) {
        cookie = false;
      }
      else if ((tmp[0].trim() == 'autoplay') && ((tmp[1].trim() == 'true') || (tmp[1].trim() == '1'))) {
        options.push("autoplay=1");
      }
      else if ((tmp[0].trim() == 'mute') && ((tmp[1].trim() == 'true') || (tmp[1].trim() == '1'))) {
        options.push("mute=1");
      }
      else if ((tmp[0].trim() == 'loop') && ((tmp[1].trim() == 'true') || (tmp[1].trim() == '1'))) {
        loop = true;
        options.push("loop=1");
      }
      else if (tmp[0].trim() == 'looplist') {
        looplist = tmp.substring(9, tmp.length).trim();
      }
    }
    if (loop) options.push("playlist=" + looplist);
  }

  const ytLink = cookie ? 'https://www.youtube.com' : 'https://www.youtube-nocookie.com';
  const embed = type === 'video' ? '/embed/' : '/embed/videoseries?list=';

  const iframeTag = htmlTag('iframe', {
    src: ytLink + embed + video_id + '/?' + options.join('&'),
    frameborder: '0',
    loading: 'lazy',
    allowfullscreen: true
  }, '');
  return `<div class="video-container">${iframeTag}</div>`
}

hexo.extend.tag.register('youtubeAdv', youtubeAdvancedTag, { ends: false });