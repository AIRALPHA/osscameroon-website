import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { BsArrowClockwise, BsXCircle } from "react-icons/bs";
import axios from "axios";
import { useRouter } from "next/router";

import { AVAILABILITY, SUGGESTIONS, TAGS, YEAR_OF_EXPERIENCES } from "@fixtures/developers";
import intl from "@utils/i18n";
import Layout from "@components/layout/layout";
import Breadcrumb from "@components/common/Breadcrumb";
import TagInput, { TagInputData } from "@components/common/TagInput";
import CheckboxList from "@components/common/CheckboxList";
import Pagination from "@components/common/Pagination";
import Developer from "@components/common/Developer";
import DeveloperDetailModal from "@components/common/DeveloperDetailModal";
import { ApiResponse, GithubUser, PaginationChangeEventData } from "@utils/types";

const { useTranslation } = intl;

const showAdvancedFilter = false;

type DevelopersProps = {
  response: ApiResponse<GithubUser[]>;
  currentPage: number;
};

const DeveloperPage = ({ currentPage, response }: DevelopersProps) => {
  const router = useRouter();
  const { i18n, t } = useTranslation(["developer", "title"]);
  const [jobTitle, setJobTitle] = useState("");
  const [tools, setTools] = useState<TagInputData[]>(TAGS);
  const [ossFilterChecked, setOssFilterChecked] = useState(false);

  const [selectedDevId, setSelectedDevId] = React.useState("");
  const [showDevModal, setShowDevModal] = React.useState(false);

  useEffect(() => {
    console.log(response);
  }, []);

  const openDevModal = () => setShowDevModal(true);

  const closeDevModal = () => {
    setSelectedDevId("");
    setShowDevModal(false);
  };

  const onTitleChange = (event) => {
    setJobTitle(event.target.value);
  };

  const onToolsListChange = (values: TagInputData[]) => {
    // eslint-disable-next-line no-console
    console.log("Tools : ", values);
    setTools(values);
  };

  const onExperienceFilterChange = (values: string[]) => {
    // eslint-disable-next-line no-console
    console.log("Experience : ", values);
  };

  const onAvailabilityFilterChange = (values: string[]) => {
    // eslint-disable-next-line no-console
    console.log("Availability : ", values);
  };

  const onFilterSubmit = () => {
    const input = {
      title: jobTitle,
      tools: tools.map((value) => value.id),
      ossFilter: ossFilterChecked,
    };

    // eslint-disable-next-line no-console
    console.log(input);
  };

  const onPaginationChange = (eventData: PaginationChangeEventData) => {
    // eslint-disable-next-line no-console
    console.log("Pagination Page : ", eventData);
    router.push(`/[lng]/developers?page=${eventData.currentPage}`);
  };

  return (
    <Layout title={t("title:developers")}>
      <Breadcrumb links={[{ title: t("title:developers"), href: "" }]} />
      <Container id="developers-list">
        <Row className="mt-30">
          <Col md="3">
            <div className="side-card filter-section">
              <div className="d-flex justify-content-between">
                <div className="bold">{t("developer:filterTitle")}</div>
                <div className="cursor-pointer text-color-main">
                  {t("developer:btnReset")} <BsArrowClockwise />
                </div>
              </div>
              <div className="selected-title d-flex justify-content-between align-items-center mt-3 mb-3">
                <div className="bold w-75">Full Stack Web Developer</div>
                <div className="cursor-pointer font-weight-bold">
                  <BsXCircle />
                </div>
              </div>
              <div className="dropdown-divider" />
              <Form>
                <FormGroup>
                  <Label className="filter-label" htmlFor="title">
                    {t("developer:jobTitleLabel")}
                  </Label>
                  <Input id="title" placeholder={t("developer:jobTitleHint")} type="text" value={jobTitle} onChange={onTitleChange} />
                </FormGroup>
                <FormGroup>
                  <Label className="filter-label" htmlFor="tools">
                    {t("developer:languageLabel")}
                  </Label>
                  <TagInput defaultValues={TAGS} suggestions={SUGGESTIONS} onChange={onToolsListChange} />
                </FormGroup>
                {showAdvancedFilter && (
                  <>
                    <div className="mb-3">
                      <Label className="filter-label" htmlFor="yoxp">
                        Years of experience
                      </Label>
                      <FormGroup check>
                        <CheckboxList defaultValues={[]} options={YEAR_OF_EXPERIENCES} onChange={onExperienceFilterChange} />
                      </FormGroup>
                    </div>
                    <div className="mt-1 mb-3">
                      <Label className="filter-label" htmlFor="availability">
                        Availability
                      </Label>
                      <FormGroup check>
                        <CheckboxList defaultValues={[]} options={AVAILABILITY} onChange={onAvailabilityFilterChange} />
                      </FormGroup>
                    </div>
                  </>
                )}
                <div className="mt-1">
                  <Label className="filter-label" htmlFor="oss">
                    {t("developer:hasOssLabel")}
                  </Label>
                  <FormGroup check>
                    <Label check>
                      <Input checked={ossFilterChecked} type="checkbox" onChange={() => setOssFilterChecked(!ossFilterChecked)} />
                      {t("developer:hasOssValue")}
                    </Label>
                  </FormGroup>
                </div>
                <div className="d-flex justify-content-center mt-4 mb-3">
                  <Button className="pl-4 pr-4" color="primary" type="button" onClick={onFilterSubmit}>
                    {t("developer:btnFilter")}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
          <Col md="9">
            <div style={{ margin: "0 15px 0 15px" }}>
              {response.result && (
                <Pagination
                  currentPage={currentPage}
                  href="/developers"
                  itemPerPage={response.result.limit}
                  nbItems={response.result.nbHits}
                  position="top"
                  query="page"
                />
              )}
              <Row className="developer-section">
                {response.result &&
                  response.result.hits.map((developer) => (
                    <Col key={`develop${developer.id}`} md={4} style={{ marginTop: "20px", marginBottom: "20px" }} onClick={openDevModal}>
                      <Developer developer={developer} />
                    </Col>
                  ))}
              </Row>
              {response.result && (
                <Pagination
                  currentPage={currentPage}
                  href="/developers"
                  itemPerPage={response.result.limit}
                  nbItems={response.result.nbHits}
                  position="bottom"
                  query="page"
                />
              )}
            </div>
          </Col>
        </Row>

        <DeveloperDetailModal devId={selectedDevId} visible={showDevModal} onClose={closeDevModal} />
      </Container>
    </Layout>
  );
};

DeveloperPage.getInitialProps = async (context) => {
  // console.log(Object.keys(context.query));
  const page = context.query.page || 1;
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/github/users/search?page=${page}`).catch((error) => {
    console.log("Error : ", error);
    return { status: error.response?.status, data: [{ ...error.response?.data }] };
  });

  return {
    namespacesRequired: ["title", "developer"],
    response: response.data,
    currentPage: page,
  };
};

export default DeveloperPage;
