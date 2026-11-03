async function auditLinks() {
  const baseUrl = 'https://stump-grinding-playbook.vercel.app';
  console.log(`Fetching live homepage from ${baseUrl}...`);
  const res = await fetch(baseUrl);
  const html = await res.text();

  // Extract all href attributes
  const hrefRegex = /href=["']([^"']+)["']/g;
  const links = new Set<string>();
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    links.add(match[1]);
  }

  // Also include standalone known routes
  const standaloneRoutes = [
    '/privacy',
    '/terms',
    '/refund-policy',
    '/contact',
    '/resend-links',
    '/downloads/Stump-Grinding-Pricing-Cheat-Sheet.pdf',
    '/images/cover.jpg',
  ];
  standaloneRoutes.forEach((r) => links.add(r));

  console.log(`Found ${links.size} unique links to audit.\n`);

  const results: any[] = [];

  const linkList = Array.from(links);
  for (const link of linkList) {
    if (link.startsWith('mailto:') || link.startsWith('tel:')) {
      results.push({ link, type: 'protocol', status: 'VALID (mailto/tel)' });
      continue;
    }

    if (link.startsWith('#')) {
      const id = link.slice(1);
      const exists = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
      results.push({ link, type: 'anchor', status: exists ? '200 OK (Anchor Exists)' : 'BROKEN (ID missing)' });
      continue;
    }

    if (link.startsWith('/#')) {
      const id = link.slice(2);
      const exists = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
      results.push({ link, type: 'anchor', status: exists ? '200 OK (Anchor Exists)' : 'BROKEN (ID missing)' });
      continue;
    }

    let urlToFetch = link;
    if (link.startsWith('/')) {
      urlToFetch = baseUrl + link;
    }

    try {
      let pageRes = await fetch(urlToFetch, { method: 'HEAD' });
      let status = pageRes.status;
      if (status === 405) {
        // Method Not Allowed for HEAD, try GET
        pageRes = await fetch(urlToFetch);
        status = pageRes.status;
      }
      results.push({
        link,
        type: link.startsWith('/') ? 'internal' : 'external',
        status: status >= 200 && status < 400 ? `${status} OK` : `FAILED (${status})`,
      });
    } catch (err: any) {
      results.push({ link, type: 'http', status: `ERROR: ${err.message}` });
    }
  }

  console.table(results);

  const broken = results.filter((r) => r.status.includes('BROKEN') || r.status.includes('FAILED') || r.status.includes('ERROR'));
  if (broken.length === 0) {
    console.log('\n ALL LINKS ARE WORKING PROPERLY (0 broken links).');
  } else {
    console.log(`\n WARNING: Found ${broken.length} broken links:`);
    console.table(broken);
  }
}

auditLinks().catch(console.error);
