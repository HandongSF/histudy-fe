import { paths } from "@/const/paths";
import test, { expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageDirPath = path.join(__dirname, "../../public/img");

const testTitle = "테스트 보고서 제목";
const testContent = "테스트 보고서 내용";
const testTotalMinutes = "58";
let testCourse = "";
let testFriend = "";

test.use({ storageState: "tests/auth/member.json" });

// 업로드한 이미지와 실제 올라간 이미지를 구분 못하는 이슈 존재
test("jpeg, png, heic 이미지 3개를 포함한 리포트 작성 후 삭제", async ({
  page,
}) => {
  await test.step("리포트 작성", async () => {
    await page.goto(paths.reports.add);

    await page.getByRole("button", { name: "인증 코드 생성" }).click();
    await page.getByRole("button", { name: "Close" }).click();

    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.getByRole("button", { name: "인증샷 업로드" }).click(),
    ]);

    await fileChooser.setFiles(path.join(imageDirPath, "IMG_4055.heic"));
    await fileChooser.setFiles(path.join(imageDirPath, "test_png.png"));
    await fileChooser.setFiles(path.join(imageDirPath, "test_jpg.jpeg"));

    await page.waitForTimeout(5000);

    const studyCard = page.locator('div[data-slot="card"]', {
      hasText: "스터디 과목",
    });
    const studyCheckbox = studyCard.getByRole("checkbox").first();
    await studyCheckbox.click();

    testCourse = (await studyCard.locator("label").first().textContent()) || "";
    testCourse = testCourse.split(" ")[0];

    const friendCard = page.locator('div[data-slot="card"]', {
      hasText: "참여 멤버",
    });

    const friendCheckbox = friendCard.getByRole("checkbox").first();
    await friendCheckbox.click();

    testFriend =
      (await friendCard.locator("label").first().textContent()) || "";

    testFriend = testFriend.split(",")[0];

    await page.locator('input[name="totalMinutes"]').fill(testTotalMinutes);

    await page.getByRole("textbox", { name: "제목" }).click();
    await page.getByRole("textbox", { name: "제목" }).fill(testTitle);
    await page.getByRole("textbox", { name: "내용" }).click();
    await page.getByRole("textbox", { name: "내용" }).fill(testContent);
    await page.getByRole("button", { name: "제출" }).click();

    // 이미지 올라간 것 확인
    await page
      .locator("tbody")
      .getByText(testTitle, { exact: true })
      .first()
      .click();

    await expect(page.getByRole("heading", { name: testTitle })).toBeVisible();

    await page.getByText("인증 사진 (3장)").click();
    await expect(page.getByText(`시간 ${testTotalMinutes}분`)).toBeVisible();
    await expect(page.getByText(testContent)).toBeVisible();
    await expect(page.getByText(testFriend)).toBeVisible();
    await expect(page.getByText(testCourse)).toBeVisible();
  });

  await test.step("리포트 삭제", async () => {
    // 이미지 접속
    await page.goto(paths.reports.root);

    await page
      .locator("tbody")
      .getByText(testTitle, { exact: true })
      .first()
      .click();

    await expect(page.getByRole("heading", { name: testTitle })).toBeVisible();

    await page.getByText("인증 사진 (3장)").click();
    await expect(page.getByText(`시간 ${testTotalMinutes}분`)).toBeVisible();
    await expect(page.getByText(testContent)).toBeVisible();

    // 이미지 삭제
    page.once("dialog", async (dialog) => {
      console.log("Dialog message:", dialog.message());
      await dialog.accept();
    });

    await page.getByRole("button", { name: "삭제" }).click();

    await page.waitForTimeout(1000);

    // 삭제 확인
    await expect(
      page.locator("tbody").getByText(testTitle, { exact: true })
    ).toHaveCount(0);
  });
});

test("7MB 이미지를 포함한 리포트 작성 후 삭제", async ({ page }) => {
  await test.step("리포트 작성", async () => {
    await page.goto(paths.reports.add);

    await page.getByRole("button", { name: "인증 코드 생성" }).click();
    await page.getByRole("button", { name: "Close" }).click();

    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.getByRole("button", { name: "인증샷 업로드" }).click(),
    ]);

    await fileChooser.setFiles(path.join(imageDirPath, "test_7MB.jpg"));

    await page.waitForTimeout(5000);

    const studyCard = page.locator('div[data-slot="card"]', {
      hasText: "스터디 과목",
    });
    const studyCheckbox = studyCard.getByRole("checkbox").first();
    await studyCheckbox.click();

    testCourse = (await studyCard.locator("label").first().textContent()) || "";
    testCourse = testCourse.split(" ")[0];

    const friendCard = page.locator('div[data-slot="card"]', {
      hasText: "참여 멤버",
    });

    const friendCheckbox = friendCard.getByRole("checkbox").first();
    await friendCheckbox.click();

    testFriend =
      (await friendCard.locator("label").first().textContent()) || "";

    testFriend = testFriend.split(",")[0];

    await page.locator('input[name="totalMinutes"]').fill(testTotalMinutes);

    await page.getByRole("textbox", { name: "제목" }).click();
    await page.getByRole("textbox", { name: "제목" }).fill(testTitle);
    await page.getByRole("textbox", { name: "내용" }).click();
    await page.getByRole("textbox", { name: "내용" }).fill(testContent);
    await page.getByRole("button", { name: "제출" }).click();

    // 이미지 올라간 것 확인
    await page
      .locator("tbody")
      .getByText(testTitle, { exact: true })
      .first()
      .click();

    await expect(page.getByRole("heading", { name: testTitle })).toBeVisible();

    await page.getByText("인증 사진 (1장)").click();
    await expect(page.getByText(`시간 ${testTotalMinutes}분`)).toBeVisible();
    await expect(page.getByText(testContent)).toBeVisible();
    await expect(page.getByText(testFriend)).toBeVisible();
    await expect(page.getByText(testCourse)).toBeVisible();
  });

  await test.step("리포트 삭제", async () => {
    // 이미지 접속
    await page.goto(paths.reports.root);

    await page
      .locator("tbody")
      .getByText(testTitle, { exact: true })
      .first()
      .click();

    await expect(page.getByRole("heading", { name: testTitle })).toBeVisible();

    await page.getByText("인증 사진 (1장)").click();
    await expect(page.getByText(`시간 ${testTotalMinutes}분`)).toBeVisible();
    await expect(page.getByText(testContent)).toBeVisible();

    // 이미지 삭제
    page.once("dialog", async (dialog) => {
      console.log("Dialog message:", dialog.message());
      await dialog.accept();
    });

    await page.getByRole("button", { name: "삭제" }).click();

    await page.waitForTimeout(1000);

    // 삭제 확인
    await expect(
      page.locator("tbody").getByText(testTitle, { exact: true })
    ).toHaveCount(0);
  });
});
