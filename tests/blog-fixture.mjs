// Synthetic articles exercise the public contract without retaining production posts in the frontend.
const names = ['1-reality-of-job-seeking', '2-remote-work-tools', '3-rethinking-object-creation', '4-debunking-devin', '5-from-panic-to-production', '6-state-of-devs-2026-ai-workflow'];
export const blogPosts = ['en', 'es'].flatMap((language, langIndex) => names.map((name, index) => ({
  id: (langIndex * 6 + index + 1).toString(16).padStart(24, '0'), slug: `${language}/${name}`,
  language, title: `${language === 'es' ? 'Artículo' : 'Article'} ${index + 1}`, excerpt: 'Synthetic article summary',
  content: `# Fixture heading\n\nA **useful** article.\n\n${index === 5 ? '<figure class="survey-chart not-prose" data-chart="code" aria-labelledby="survey-code-title"><figcaption><h3 id="survey-code-title">Fixture chart</h3><span class="sample">10 answers</span></figcaption><ul class="chart-rows"><li class="chart-row" tabindex="0" aria-label="AI: 50%"><div class="row-heading"><span>AI</span><strong>50%</strong></div><div class="bar-track"><span class="bar-fill" style="width: 50%"></span></div><span class="chart-tooltip">5 / 10 answers</span></li></ul></figure>\n\n<details><summary>Sources</summary>Fixture source</details>\n\n<script>window.__blogAttack = true</script><img src="javascript:alert(1)" onerror="window.__blogAttack=true">' : ''}`,
  author: 'Fixture author', anonymous: index === 5, categories: ['software-development'],
  coverImage: '/blog-assets/images/test.jpg', status: 'published', publishedAt: `2026-0${index + 1}-01T00:00:00.000Z`,
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', displayDate: `01/0${index + 1}/2026`, readingMinutes: 2,
})));
