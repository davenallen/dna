import Link from "next/link";
import usePagination from '@library/usePagination.js'
import { TextLink } from "@components/system";

export const dotts = '...'

const Pagination = ({ currentPage, totalItems, perPage, renderPageLink }) => {
    const pages = usePagination(totalItems, currentPage, perPage)

    return (
        <>
        {/* pagination */}
        <div className="dna-a dna-pagination">
            {currentPage > 1 &&
            <TextLink key="pagination-item-prev" href={renderPageLink(currentPage - 1)} direction="left">Prev</TextLink>
            }
            {currentPage <= 1 &&
            <TextLink key="pagination-item-prev" direction="left">Prev</TextLink>
            }

            <div className="dna-pagination-center dna-m-hidden">
                {pages.map((pageNumber, i) =>
                    pageNumber === dotts ? (
                        <span className="mil-pagination-text" key={`pagination-item-${i}`}>
                            {pageNumber}
                        </span>
                    ) : (
                        <Link href={renderPageLink(pageNumber)} key={`pagination-item-${i}`} className={`${pageNumber === currentPage ? 'dna-active-pag' : ''}`}>
                            {pageNumber}
                        </Link>
                    )
                )}
            </div>

            {currentPage < pages.length &&
            <TextLink key="pagination-item-next" href={renderPageLink(currentPage + 1)}>Next</TextLink>
            }
            {currentPage == pages.length &&
            <TextLink key="pagination-item-next">Next</TextLink>
            }
        </div>
        {/* pagination end */}
        </>
    );
  };
  export default Pagination;