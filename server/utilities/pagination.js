function updatePage (originalUrl, currentPage) {
  let newUrl
  if (originalUrl.indexOf('page=') !== -1) {
    newUrl = originalUrl.replace(/page=[^&]+/, 'page=' + currentPage)
  } else if (originalUrl.indexOf('?') === -1) {
    newUrl = originalUrl + '?page=' + currentPage
  } else {
    newUrl = originalUrl + '&page=' + currentPage
  }

  return newUrl
}

function getPaginatedPagesCount (itemsCount, limit) {
  let pagesCount

  if (itemsCount > 0 && itemsCount <= limit) {
    pagesCount = 1
  } else if (itemsCount > 0 && itemsCount % limit === 0) {
    pagesCount = itemsCount / limit
  } else if (itemsCount > 0 && itemsCount % limit !== 0) {
    pagesCount = itemsCount / limit + 1
  }

  return parseInt(pagesCount)
}

function getPaginationLinks (itemsCount, limit, url, currentPage) {
  let paginationLinks = []

  if (itemsCount > 0) {
    let pagesCount = this.getPaginatedPagesCount(itemsCount, limit)
    let startPage
    let endPage
    let maxPagesCount = pagesCount < 7 ? pagesCount : 7

    if (currentPage === 1 || currentPage === 2 || currentPage === 3) {
      startPage = 1
      endPage = maxPagesCount
    } else if (currentPage === pagesCount || currentPage === pagesCount - 1 || currentPage === pagesCount - 2) {
      startPage = pagesCount - maxPagesCount + 1
      endPage = pagesCount
    } else {
      startPage = currentPage - 3
      endPage = currentPage + 3
    }

    for (let i = startPage; i <= endPage; i++) {
      let currentPaginationLink = { url: this.updatePage(url, i), pageNumber: i, active: currentPage === i }
      paginationLinks.push(currentPaginationLink)
    }
  }

  return paginationLinks
}

function getPreviousPageUrl (pagesCount, currentPage, url) {
  let previousPage = pagesCount === 1 ? 1 : currentPage === 1 ? 1 : Number(currentPage) - 1
  let previousPageUrl = this.updatePage(url, previousPage)

  return previousPageUrl
}

function getNextPageUrl (pagesCount, currentPage, url) {
  let nextPage = pagesCount === currentPage ? pagesCount : Number(currentPage) + 1
  let nextPageUrl = this.updatePage(url, nextPage)

  return nextPageUrl
}

function hasPreviousPage (currentPage) {
  return currentPage > 1
}

function hasNextPage (currentPage, pagesCount) {
  return currentPage !== pagesCount
}

module.exports = {
  updatePage,
  getPaginatedPagesCount,
  getPaginationLinks,
  getPreviousPageUrl,
  getNextPageUrl,
  hasPreviousPage,
  hasNextPage
}
