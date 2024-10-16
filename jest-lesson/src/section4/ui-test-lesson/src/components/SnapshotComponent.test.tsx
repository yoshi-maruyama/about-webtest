import { render } from "@testing-library/react";
import SnapshotComponent from "./SnapshotComponent";

it("Snapshotテスト", () => {
  const { container } = render(<SnapshotComponent text="Vue" />);
  expect(container).toMatchSnapshot();
});
